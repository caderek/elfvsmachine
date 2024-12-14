import fs from "node:fs"
import path from "node:path"

import { config } from "../../config.js"
import { fetchYearPriv } from "./fetchYearPriv.js"
import { getCurrent } from "./util.js"

export async function fetchAllPriv(sessionKey) {
  const { currentYear } = getCurrent()

  if (!fs.existsSync(config.DATA_PRIV_DIR)) {
    fs.mkdirSync(config.DATA_PRIV_DIR, { recursive: true })
  }

  const privFile = path.join(config.DATA_PRIV_DIR, "stats.json")

  let oldStats

  try {
    oldStats = JSON.parse(fs.readFileSync(privFile, { encoding: "utf8" }))
  } catch {}

  const stats = oldStats ?? {}

  for (let year = config.START_FROM_YEAR; year <= currentYear; year++) {
    if ((stats[year]?.stars ?? 0) < 50) {
      stats[year] = await fetchYearPriv(year, sessionKey)
    }
  }

  fs.writeFileSync(privFile, JSON.stringify(stats, null, 2))
}
