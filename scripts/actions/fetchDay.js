import { JSDOM } from "jsdom"
import { fetchPub, getSeconds } from "./util.js"

export async function fetchDay(year, day) {
  const res = await fetchPub(
    `https://adventofcode.com/${year}/leaderboard/day/${day}`,
  )

  if (!res.ok) {
    return null
  }

  const content = await res.text()
  const dom = new JSDOM(content)

  const nodes = [...dom.window.document.querySelectorAll("main > *")]

  let entriesStarted = false
  let part = 2

  const entries = {
    1: [],
    2: [],
  }

  for (const node of nodes) {
    const isEntry = node.classList.contains("leaderboard-entry")
    if (!isEntry && entriesStarted) {
      part = 1
    } else if (isEntry) {
      entriesStarted = true
      const userId = node.dataset.userId
      const place = node.querySelector(".leaderboard-position").textContent
      const time = node.querySelector(".leaderboard-time").textContent
      const user = node.textContent.replace(place, "").replace(time, "").trim()
      const link = node.querySelector("a")?.href ?? null
      entries[part].push({
        userId: Number(userId),
        user,
        link,
        place: Number(place.replace(")", "").trim()),
        time: getSeconds(time),
      })
    }
  }

  return {
    year,
    day,
    results: entries,
  }
}
