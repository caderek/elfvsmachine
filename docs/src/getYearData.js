const cache = {}

export async function getYearData(year) {
  if (cache[year]) {
    return cache[year]
  }

  const res = await fetch(`data/${year}.json`)
  const entries = await res.json()
  const data = { year, entries }

  cache[year] = data
  return data
}
