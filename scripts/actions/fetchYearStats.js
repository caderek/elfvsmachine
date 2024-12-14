import fs from "node:fs"
import path from "node:path"
import { JSDOM } from "jsdom"

import { config } from "../../config.js"
import { fetchPub } from "./util.js"

async function fetchYearStats(year) {
  const res = await fetchPub(`https://adventofcode.com/${year}/stats`)

  if (!res.ok) {
    return null
  }

  const content = await res.text()
  const dom = new JSDOM(content)

  const $stats = [...dom.window.document.querySelectorAll(".stats > a")]

  const yearStats = $stats
    .map((node) => {
      return (node.textContent.match(/\d+/g) ?? []).map(Number)
    })
    .filter((x) => x.length === 3)
    .map(([day, both, firstOnly]) => [day, { both, first: both + firstOnly }])

  return Object.fromEntries(yearStats)
}

export async function fetchYearsStats(startYear, currentYear) {
  const yearsStats = {}

  for (let year = startYear; year <= currentYear; year++) {
    const stats = await fetchYearStats(year)

    if (!stats) {
      yearsStats[year] = {}
      console.error(`Stats for ${year} cannot be fetched!`)
    } else {
      yearsStats[year] = await fetchYearStats(year)
      console.log(`Stats for ${year} fetched!`)
    }
  }

  const fileName = `stats.json`
  const outPath = path.join(config.RAW_DATA_DIR, fileName)

  fs.writeFileSync(outPath, JSON.stringify(yearsStats, null, 2))
}
