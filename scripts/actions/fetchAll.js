import fs from "node:fs"

import { config } from "../../config.js"
import { fetchYear } from "./fetchYear.js"

export async function fetchAll() {
  const done = fs.existsSync(config.RAW_DATA_DIR)
    ? fs.readdirSync(config.RAW_DATA_DIR).map((name) =>
        name
          .replace(/\.json$/, "")
          .split("-")
          .map(Number),
      )
    : []

  const doneByYear = {}

  for (const [year, day] of done) {
    if (!doneByYear[year]) {
      doneByYear[year] = new Set()
    }

    doneByYear[year].add(day)
  }

  const now = new Date()

  const options = { year: "numeric", timeZone: "America/New_York" } // UTC-5 as AoC starts
  const formatter = new Intl.DateTimeFormat("en-US", options)
  const currentYear = Number(formatter.format(now))

  for (let year = config.START_FROM__YEAR; year <= currentYear; year++) {
    await fetchYear(year, doneByYear[year] ?? new Set())
  }
}
