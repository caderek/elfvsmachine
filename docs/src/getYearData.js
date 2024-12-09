const cache = {}

export async function getYearData(year) {
  if (cache[year]) {
    return cache[year]
  }

  const res = await fetch(`data/${year}.json`)
  const data = await res.json()

  cache[year] = data
  return data
}
