import fs from "node:fs"
import path from "node:path"

import { config } from "../../config.js"
import { calculateMedian } from "./math.js"

function prepareScores(results) {
  if (results.length < 100) {
    return null
  }

  const maxPoints = calculateMedian(results.map((x) => x.time))
  const minPoints = maxPoints / 100

  const sorted = results.toSorted((a, b) => a.time - b.time)

  const scored = []
  let pos = 0
  let jump = 1
  let prevTime = -1

  for (const result of sorted) {
    if (result.time === prevTime) {
      jump++
    } else {
      pos += jump
      jump = 1
    }

    scored.push([
      pos,
      result.userId,
      result.time,
      Number(((results.length - (pos - 1)) * minPoints).toFixed(3)),
    ])

    prevTime = result.time
  }

  return scored
}

function prepareUsers(entries) {
  const users = {}

  for (const { userId, user, userLink } of entries) {
    users[userId] = [user, userLink]
  }

  return users
}

function prepareDay(rawData) {
  return {
    users: prepareUsers([
      ...(rawData.results["1"] ?? []),
      ...(rawData.results["2"] ?? []),
    ]),
    results: {
      1: prepareScores(rawData.results["1"] ?? []),
      2: prepareScores(rawData.results["2"] ?? []),
    },
  }
}

export function prepareData() {
  const dayFiles = fs.readdirSync(config.RAW_DATA_DIR)
  const byYear = {}

  for (const file of dayFiles) {
    const [year, day] = file.match(/\d+/g).map(Number)
    const filePath = path.join(config.RAW_DATA_DIR, file)

    const rawData = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }))

    const { users, results } = prepareDay(rawData)

    if (!byYear[year]) {
      byYear[year] = { users: {}, days: {} }
    }

    byYear[year].users = { ...byYear[year].users, ...users }

    byYear[year].days[day] = results
  }

  if (!fs.existsSync(config.DATA_DIR)) {
    fs.mkdirSync(config.DATA_DIR, { recursive: true })
  }

  const index = {}

  for (const [year, data] of Object.entries(byYear)) {
    const filePath = path.join(config.DATA_DIR, `${year}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data))

    index[year] = Math.max(...Object.keys(data.days).map(Number))
  }

  fs.writeFileSync(
    path.join(config.DATA_DIR, "index.json"),
    JSON.stringify(index),
  )
}
