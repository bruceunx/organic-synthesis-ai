import requests


def test_reactions():
    url = "http://127.0.0.1:6001/predictions/reaxys"
    # url = "http://127.0.0.1:8000/get-conditions"

    # headers = {"Content-Type": "application/json"}

    # smiles = "CC1(C)OBOC1(C)C.Cc1ccc(Br)cc1>>Cc1cccc(B2OC(C)(C)C(C)(C)O2)c1"

    res = requests.post(url, json={"smiles": ["CCC"]})
    # res = requests.post(url, json={"smiles": smiles})

    data = res.json()[0]
    print(data)
    """
    "templates"
    "reactants"
    "scores"

    in data
    """


def test_conditions():

    url = "http://127.0.0.1:6006/get-conditions"

    headers = {"Content-Type": "application/json"}

    smiles = "CC1(C)OBOC1(C)C.Cc1ccc(Br)cc1>>Cc1cccc(B2OC(C)(C)C(C)(C)O2)c1"

    res = requests.post(url, json={"smiles": smiles}, headers=headers)

    data = res.json()
    print(data)

test_conditions()
