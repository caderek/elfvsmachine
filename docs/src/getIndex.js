export async function getIndex() {
  const res = await fetch("data/index.json")
  return res.json()
}
