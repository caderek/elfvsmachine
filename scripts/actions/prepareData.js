import fs from "node:fs"
import path from "node:path"

import { config } from "../../config.js"
import { calculateMedian } from "./util.js"

function prepareScores(results) {
  if (results.length < 100) {
    return null
  }

  return results
    .toSorted((a, b) => a.time - b.time)
    .map((result) => {
      return [result.userId, result.time]
    })
}

const getGithubUsername = (link) => {
  return link && link.startsWith("https://github.com/")
    ? link.replace("https://github.com/", "")
    : null
}

function prepareUsers(entries) {
  const users = {}

  for (const { userId, user, link } of entries) {
    users[userId] = [
      user.replace("(AoC++)", "").replace(" (Sponsor)", "").trim(),
      getGithubUsername(link),
    ]
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

function updateIndexHtml(timestamp) {
  const indexPath = path.join(config.PUBLIC_DIR, "index.html")
  const html = fs.readFileSync(indexPath, {
    encoding: "utf8",
  })

  const updatePattern = /data-last-update=".*?"/
  const newHtml = html.replace(updatePattern, `data-last-update="${timestamp}"`)

  fs.writeFileSync(indexPath, newHtml)
}

export function prepareData() {
  fs.rmSync(config.DATA_DIR, { recursive: true })
  fs.mkdirSync(config.DATA_DIR, { recursive: true })

  const timestamp = Date.now()
  const dayFiles = fs.readdirSync(config.RAW_DATA_DIR)
  const byYear = {}
  let allUsers = {}

  for (const file of dayFiles) {
    const [year, day] = file.match(/\d+/g).map(Number)
    const filePath = path.join(config.RAW_DATA_DIR, file)

    const rawData = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }))

    const { users, results } = prepareDay(rawData)

    if (!byYear[year]) {
      byYear[year] = {}
    }

    allUsers = { ...allUsers, ...users }

    byYear[year][day] = results
  }

  const index = {}

  for (const [year, data] of Object.entries(byYear)) {
    const filePath = path.join(config.DATA_DIR, `${year}-${timestamp}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data))

    index[year] = Math.max(...Object.keys(data).map(Number))
  }

  fs.writeFileSync(
    path.join(config.DATA_DIR, `users-${timestamp}.json`),
    JSON.stringify(allUsers),
  )

  fs.writeFileSync(
    path.join(config.DATA_DIR, `index-${timestamp}.json`),
    JSON.stringify(index),
  )

  updateIndexHtml(timestamp)
}
