import { JSDOM } from "jsdom"
import { fetchPriv, getSeconds } from "./util.js"

export async function fetchYearPriv(year, sessionKey) {
  const res = await fetchPriv(
    `https://adventofcode.com/${year}/leaderboard/self`,
    sessionKey,
  )

  console.log(`Fetched private stats for ${year}`)

  const content = await res.text()
  const dom = new JSDOM(content)

  const rawStats =
    dom.window.document.querySelector("main > article > pre")?.textContent ??
    null

  if (!rawStats) {
    return null
  }

  const stats = rawStats
    .trim()
    .split("\n")
    .slice(2)
    .map((line) => {
      const [day, time1, pos1, pts1, time2, pos2, pts2] = line
        .trim()
        .split(/\s+/)

      const stats1 =
        time1 !== "-"
          ? {
              time: getSeconds(time1),
              pos: pos1 === "-" ? null : Number(pos1),
              points: pts1 === "-" ? null : Number(pts1),
            }
          : null

      const stats2 =
        time2 !== "-"
          ? {
              time: getSeconds(time2),
              pos: pos2 === "-" ? null : Number(pos2),
              points: pts2 === "-" ? null : Number(pts2),
            }
          : null

      return [
        Number(day),
        {
          1: stats1,
          2: stats2,
        },
      ]
    })

  const days = new Set(stats.map(([day]) => day))

  for (let i = 1; i <= 25; i++) {
    if (!days.has(i)) {
      stats.push([i, { 1: null, 2: null }])
    }
  }

  stats.sort((a, b) => a[0] - b[0])

  const stars = stats.reduce(
    (sum, [_, val]) => sum + (val[1] ? 1 : 0) + (val[2] ? 1 : 0),
    0,
  )

  return { days: Object.fromEntries(stats), stars }
}
