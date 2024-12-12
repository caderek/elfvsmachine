export async function getIndex(lastUpdate) {
  const res = await fetch(`data/index-${lastUpdate}.json`)
  return res.json()
}
