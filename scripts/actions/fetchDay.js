import { JSDOM } from "jsdom"

function getSeconds(result) {
  const [h, m, s] = result.trim().split(/\s+/).at(-1).split(":").map(Number)
  return h * 60 * 60 + m * 60 + s
}

export async function fetchDay(year, day) {
  const res = await fetch(
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
      const userLink = node.querySelector("a")?.href ?? null
      const userPic = node.querySelector("img")?.src ?? null
      entries[part].push({
        userId: Number(userId),
        user,
        userLink,
        userPic,
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
