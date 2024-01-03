import requests

url = "http://127.0.0.1:8080/predictions/reaxys"

headers = {"Content-Type": "application/json"}

res = requests.post(url, json={"smiles":["CCC"]})

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
