const API = 'http://127.0.0.1:8080'

export const findRoutes = async (smiles: string) => {
  const url = `${API}/predictions/reaxys`

  const data = { smiles: [smiles] }
  const res = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  console.log(res.json())
}
