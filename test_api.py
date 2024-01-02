import requests

url = "http://127.0.0.1:8080/predictions/reaxys"

headers = {"Content-Type": "application/json"}

res = requests.post(url, json={"smiles":["C1C=CC=C(C(=O)OCC(=O)C2C=CC=C2)C=1"]})

data = res.json()[0]
print(data)
breakpoint()

"""
"templates"
"reactants"
"scores"

in data
"""

breakpoint()
