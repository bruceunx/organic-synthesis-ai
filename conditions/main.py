from typing import List, Tuple, Dict, Optional
from pathlib import Path
import pickle

import numpy as np
from scipy import stats
from rdkit import Chem
from rdkit.Chem import AllChem, DataStructs

import onnxruntime as ort


def mol_smi_to_morgan_fp(
    smi: str,
    /,
    radius: int = 2,
    length: int = 2048,
    as_column: bool = False,
    dtype: str = "float32",
    **fp_kwargs,
) -> np.ndarray:
    try:
        mol = Chem.MolFromSmiles(smi)
        fp_bit = AllChem.GetMorganFingerprintAsBitVect(mol,
                                                       radius,
                                                       nBits=length,
                                                       **fp_kwargs)
        fp = np.empty(length, dtype)
        DataStructs.ConvertToNumpyArray(fp_bit, fp)
    except Exception:
        fp = np.zeros(length, dtype)
    if as_column:
        return fp.reshape(1, -1)
    else:
        return fp


def reac_prod_smi_to_morgan_fp(
    reactant: str,
    pdt: str,
    radius: int = 2,
    length: int = 2048,
    as_column: bool = False,
    **fp_kwargs,
) -> Tuple[np.ndarray, np.ndarray]:
    params: Dict[str, int | bool | str] = dict(
        radius=radius,
        length=length,
        as_column=as_column,
    )
    params.update(fp_kwargs)
    rfp = mol_smi_to_morgan_fp(reactant, **params)  # type: ignore
    pfp = mol_smi_to_morgan_fp(pdt, **params)  # type: ignore
    return pfp, rfp


class NeuralNetContextRecommender:

    def __init__(self, with_smiles: bool = False) -> None:
        self.c1_dim = 803
        self.r1_dim = 2240
        self.r2_dim = 1979
        self.s1_dim = 232
        self.s2_dim = 228

        self.fp_size = 16384
        self.with_smiles = with_smiles
        self.ehs_dict: Dict[str, int] = {}

    def load(self):
        self.load_nn_model()
        self.load_ehs_dictionary("./assets/ehs_solvent_scores.csv")
        return self

    def load_nn_model(self):
        info_path = Path("./assets/")
        r1_dict_file = info_path / "r1_dict.pickle"
        r2_dict_file = info_path / "r2_dict.pickle"
        s1_dict_file = info_path / "s1_dict.pickle"
        s2_dict_file = info_path / "s2_dict.pickle"
        c1_dict_file = info_path / "c1_dict.pickle"

        with open(r1_dict_file, "rb") as R1_DICT_F:
            self.r1_dict = pickle.load(R1_DICT_F)

        with open(r2_dict_file, "rb") as R2_DICT_F:
            self.r2_dict = pickle.load(R2_DICT_F)

        with open(s1_dict_file, "rb") as S1_DICT_F:
            self.s1_dict = pickle.load(S1_DICT_F)

        with open(s2_dict_file, "rb") as S2_DICT_F:
            self.s2_dict = pickle.load(S2_DICT_F)

        with open(c1_dict_file, "rb") as C1_DICT_F:
            self.c1_dict = pickle.load(C1_DICT_F)

        self.T_func = ort.InferenceSession(info_path / "T_func.onnx")
        self.fp_func = ort.InferenceSession(info_path / "fp_func.onnx")
        self.c1_func = ort.InferenceSession(info_path / "c1_func.onnx")
        self.r1_func = ort.InferenceSession(info_path / "r1_func.onnx")
        self.r2_func = ort.InferenceSession(info_path / "r2_func.onnx")
        self.s1_func = ort.InferenceSession(info_path / "s1_func.onnx")
        self.s2_func = ort.InferenceSession(info_path / "s2_func.onnx")

    def smiles_to_fp(self, smiles):

        rsmi, _, psmi = smiles.split(">")
        rct_mol = Chem.MolFromSmiles(rsmi)
        prd_mol = Chem.MolFromSmiles(psmi)
        [
            atom.ClearProp("molAtomMapNumber") for atom in rct_mol.GetAtoms()
            if atom.HasProp("molAtomMapNumber")
        ]
        [
            atom.ClearProp("molAtomMapNumber") for atom in prd_mol.GetAtoms()
            if atom.HasProp("molAtomMapNumber")
        ]
        rsmi = Chem.MolToSmiles(rct_mol, isomericSmiles=True)
        psmi = Chem.MolToSmiles(prd_mol, isomericSmiles=True)
        pfp, rfp = reac_prod_smi_to_morgan_fp(rsmi,
                                              psmi,
                                              length=self.fp_size,
                                              as_column=True,
                                              useFeatures=False,
                                              useChirality=True)
        rxnfp = pfp - rfp
        return pfp, rxnfp

    def recommend(
        self,
        smi: str,
        reagents: Optional[List[str]],
        n_conditions: int,
        with_smiles=False,
        return_scores=True,
        return_separate=False,
    ) -> list:
        return self.get_n_conditions(smi, n_conditions, with_smiles, return_scores,
                                     return_separate)

    def get_n_conditions(
        self,
        smi: str,
        n_conditions: int = 10,
        with_smiles=False,
        return_scores=False,
        return_separate=False,
    ):
        self.with_smiles = with_smiles
        try:
            pfp, rxnfp = self.smiles_to_fp(smi)
            inputs = [pfp, rxnfp] + [[] for _ in range(5)]

            top_combos, top_combo_scores = self.predict_top_combos(
                inputs=inputs, return_categories_only=return_separate)

            top_combo_scores = [float(score) for score in top_combo_scores]

            top_combos, top_combo_scores = (
                top_combos[:n_conditions],
                top_combo_scores[:n_conditions],
            )
            if not return_separate:
                top_combos = self.contexts_ehs_scores(top_combos[:n_conditions])

            if return_scores:
                return top_combos, top_combo_scores
            else:
                return top_combos
        except Exception:
            return [[]]

    def predict_top_combos(
        self,
        inputs,
        return_categories_only=False,
        c1_rank_thres=2,
        s1_rank_thres=3,
        s2_rank_thres=1,
        r1_rank_thres=3,
        r2_rank_thres=1,
    ):
        context_combos = []
        context_combo_scores = []
        num_combos = c1_rank_thres * s1_rank_thres * s2_rank_thres * r1_rank_thres * r2_rank_thres
        [
            pfp,
            rxnfp,
            c1_input_user,
            r1_input_user,
            r2_input_user,
            s1_input_user,
            s2_input_user,
        ] = inputs

        self.pfp = pfp
        self.rxnfp = rxnfp
        fp_trans = self.fp_func.run(None, {"input_pfp": pfp, "input_rxnfp": rxnfp})[0]
        if not c1_input_user:
            c1_pred = self.c1_func.run(None, {"input_h2": fp_trans})[0]
            c1_cdts = c1_pred[0].argsort()[-c1_rank_thres:][::-1]
        else:
            c1_cdts = np.nonzero(c1_input_user)[0]
        # find the name of catalyst
        for c1_cdt in c1_cdts:
            c1_name = self.c1_dict[c1_cdt]
            c1_input = np.zeros([1, self.c1_dim])
            c1_input[0, c1_cdt] = 1
            if not c1_input_user:
                c1_sc = c1_pred[0][c1_cdt]
            else:
                c1_sc = 1
            if not s1_input_user:
                s1_pred = self.s1_func.run(None, {
                    "input_h2": fp_trans,
                    "input_c1": c1_input.astype(np.float32)
                })[0]
                s1_cdts = s1_pred[0].argsort()[-s1_rank_thres:][::-1]
            else:
                s1_cdts = np.nonzero(s1_input_user)[0]
            for s1_cdt in s1_cdts:
                s1_name = self.s1_dict[s1_cdt]
                s1_input = np.zeros([1, self.s1_dim])
                s1_input[0, s1_cdt] = 1
                if not s1_input_user:
                    s1_sc = s1_pred[0][s1_cdt]
                else:
                    s1_sc = 1
                if not s2_input_user:
                    s2_pred = self.s2_func.run(
                        None, {
                            "input_h2": fp_trans,
                            "input_c1": c1_input.astype(np.float32),
                            "input_s1": s1_input.astype(np.float32)
                        })[0]
                    s2_cdts = s2_pred[0].argsort()[-s2_rank_thres:][::-1]
                else:
                    s2_cdts = np.nonzero(s2_input_user)[0]
                for s2_cdt in s2_cdts:
                    s2_name = self.s2_dict[s2_cdt]
                    s2_input = np.zeros([1, self.s2_dim])
                    s2_input[0, s2_cdt] = 1
                    if not s2_input_user:
                        s2_sc = s2_pred[0][s2_cdt]
                    else:
                        s2_sc = 1
                    if not r1_input_user:
                        r1_pred = self.r1_func.run(
                            None, {
                                "input_h1": fp_trans,
                                "input_c1": c1_input.astype(np.float32),
                                "input_s1": s1_input.astype(np.float32),
                                "input_s2": s2_input.astype(np.float32)
                            })[0]
                        r1_cdts = r1_pred[0].argsort()[-r1_rank_thres:][::-1]
                    else:
                        r1_cdts = np.nonzero(r1_input_user)[0]
                    for r1_cdt in r1_cdts:
                        r1_name = self.r1_dict[r1_cdt]
                        r1_input = np.zeros([1, self.r1_dim])
                        r1_input[0, r1_cdt] = 1
                        if not r1_input_user:
                            r1_sc = r1_pred[0][r1_cdt]
                        else:
                            r1_sc = 1
                        if not r2_input_user:
                            r2_pred = self.r2_func.run(
                                None, {
                                    "input_h1": fp_trans,
                                    "input_c1": c1_input.astype(np.float32),
                                    "input_s1": s1_input.astype(np.float32),
                                    "input_s2": s2_input.astype(np.float32),
                                    "input_r1": r1_input.astype(np.float32),
                                })[0]
                            r2_cdts = r2_pred[0].argsort()[-r2_rank_thres:][::-1]
                        else:
                            r2_cdts = np.nonzero(r2_input_user)[0]
                        for r2_cdt in r2_cdts:
                            r2_name = self.r2_dict[r2_cdt]
                            r2_input = np.zeros([1, self.r2_dim])
                            r2_input[0, r2_cdt] = 1
                            if not r2_input_user:
                                r2_sc = r2_pred[0][r2_cdt]
                            else:
                                r2_sc = 1
                            T_pred = self.T_func.run(
                                None, {
                                    "input_h1": fp_trans,
                                    "input_c1": c1_input.astype(np.float32),
                                    "input_s1": s1_input.astype(np.float32),
                                    "input_s2": s2_input.astype(np.float32),
                                    "input_r1": r1_input.astype(np.float32),
                                    "input_r2": r2_input.astype(np.float32),
                                })[0]
                            # print(c1_name,s1_name,s2_name,r1_name,r2_name)
                            cat_name = [c1_name]
                            if r2_name == "":
                                rgt_name = [r1_name]
                            else:
                                rgt_name = [r1_name, r2_name]
                            if s2_name == "":
                                slv_name = [s1_name]
                            else:
                                slv_name = [s1_name, s2_name]
                            if self.with_smiles:
                                rgt_name = [
                                    rgt for rgt in rgt_name if "Reaxys" not in rgt
                                ]
                                slv_name = [
                                    slv for slv in slv_name if "Reaxys" not in slv
                                ]
                                cat_name = [
                                    cat for cat in cat_name if "Reaxys" not in cat
                                ]
                            # for testing purpose only, output order as training
                            if return_categories_only:
                                context_combos.append([
                                    c1_name,
                                    s1_name,
                                    s2_name,
                                    r1_name,
                                    r2_name,
                                    float(T_pred[0][0]),
                                ])
                            # else output format compatible with the overall framework
                            else:
                                context_combos.append([
                                    float(T_pred[0][0]),
                                    ".".join(slv_name),
                                    ".".join(rgt_name),
                                    ".".join(cat_name),
                                ])

                            context_combo_scores.append(c1_sc * s1_sc * s2_sc * r1_sc *
                                                        r2_sc)
        context_ranks = list(num_combos + 1 - stats.rankdata(context_combo_scores))

        context_combos = [
            context_combos[context_ranks.index(i + 1)] for i in range(num_combos)
        ]
        context_combo_scores = [
            context_combo_scores[context_ranks.index(i + 1)] for i in range(num_combos)
        ]

        return context_combos, context_combo_scores

    # Edited by Aaron Chen
    def postprocess(self, context_combos):

        output = []
        for c1_name, s1_name, s2_name, r1_name, r2_name, T_pred in context_combos:
            cat_name = [c1_name]
            if r2_name == "":
                rgt_name = [r1_name]
            else:
                rgt_name = [r1_name, r2_name]
            if s2_name == "":
                slv_name = [s1_name]
            else:
                slv_name = [s1_name, s2_name]

            if self.with_smiles:
                rgt_name = [rgt for rgt in rgt_name if "Reaxys" not in rgt]
                slv_name = [slv for slv in slv_name if "Reaxys" not in slv]
                cat_name = [cat for cat in cat_name if "Reaxys" not in cat]

            output.append([
                float(T_pred),
                ".".join(slv_name),
                ".".join(rgt_name),
                ".".join(cat_name),
            ])
        return output

    def load_ehs_dictionary(self, ehs_score_path: str) -> None:
        self.ehs_dict = {}
        with open(ehs_score_path, "r") as f:
            for i, line in enumerate(f):
                if i == 0:
                    continue
                a = line.strip().split(",")
                key = a[2]
                value = a[3]
                _value: int
                if value.isdigit():
                    _value = int(value)
                else:
                    _value = 7
                self.ehs_dict[key] = _value

    def contexts_ehs_scores(self, top_combos):
        best_score = self.combo_ehs_score(top_combos)
        for item in top_combos:
            item.append(item[-1] == best_score)
        return top_combos

    def combo_ehs_score(self, context_combos, best=True):
        scores = []
        for item in context_combos:
            solvent = item[1]
            if solvent in self.ehs_dict:
                score = self.ehs_dict[solvent]
            elif "." in solvent:
                solvents = solvent.split(".")
                sub_scores = []
                for s in solvents:
                    if s in self.ehs_dict:
                        sub_scores.append(self.ehs_dict[s])
                if sub_scores:
                    score = sum(sub_scores) / len(sub_scores)
                else:
                    score = None
            else:
                score = None
            item.append(score)
            if score is not None:
                scores.append(score)

        if scores:
            if best:
                return min(scores)
            else:
                return sum(scores) / len(scores)
        else:
            return 8


if __name__ == "__main__":
    model = NeuralNetContextRecommender().load()
    print(
        model.recommend(
            "CC1(C)OBOC1(C)C.Cc1ccc(Br)cc1>>Cc1cccc(B2OC(C)(C)C(C)(C)O2)c1",
            None,
            10,
            with_smiles=True,
            return_scores=True,
        ))
