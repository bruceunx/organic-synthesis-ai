from fastapi import FastAPI, status
from pydantic import BaseModel

from server import NeuralNetContextRecommender

app = FastAPI()

model = NeuralNetContextRecommender().load()


class ConditionSchema(BaseModel):
    reactants: str
    product: str


@app.post("/get-conditions", status_code=status.HTTP_200_OK)
def get_conditions(inquire: ConditionSchema):

    reaction = inquire.reactants + ">>" + inquire.product
    results = model.recommend(
        reaction,
        None,
        10,
        with_smiles=True,
        return_scores=True,
    )
    return {"results": results}
