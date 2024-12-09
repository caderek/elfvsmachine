import fs from "node:fs"
import path from "node:path"

import { config } from "../../config.js"
import { fetchDay } from "./fetchDay.js"

export async function fetchYear(year, daysDone) {
  for (let day = 1; day <= 25; day++) {
    if (daysDone.has(day)) {
      console.warn(`${year} ${day} already fetched!`)
      continue
    }

    const data = await fetchDay(year, day)

    if (!data) {
      console.error(`${year} ${day} cannot be fetched!`)
      continue
    }

    console.log(`${year} ${day} fetched!`)

    if (!fs.existsSync(config.RAW_DATA_DIR)) {
      fs.mkdirSync(config.RAW_DATA_DIR)
    }

    const fileName = `${year}-${String(day).padStart(2, "0")}.json`
    const outPath = path.join(config.RAW_DATA_DIR, fileName)

    fs.writeFileSync(outPath, JSON.stringify(data, null, 2))
  }
}
