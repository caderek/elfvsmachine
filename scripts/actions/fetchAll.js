import fs from "node:fs"

import { config } from "../../config.js"
import { fetchYear } from "./fetchYear.js"
import { getCurrent } from "./util.js"

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

  const { currentYear, currentDay } = getCurrent()

  for (let year = config.START_FROM_YEAR; year <= currentYear; year++) {
    const maxDay = year === currentYear ? currentDay : 25
    await fetchYear(year, doneByYear[year] ?? new Set(), maxDay)
  }
}
