import { calculateMedian } from "./util.js"

function preparePartData(partData, users, algo, part) {
  const medianTime = calculateMedian(partData.map(([_, sec]) => sec))

  const entries = []

  for (const [i, [userId, time, pos]] of partData.entries()) {
    const originalPoints = 101 - pos
    let points =
      algo === "original"
        ? originalPoints
        : algo === "inverse"
          ? partData[partData.length - i - 1][1]
          : Math.max(1, Math.floor(((101 - pos) / 100) * medianTime))

    entries.push({
      pos,
      userId,
      user: users[userId][0],
      gh: users[userId][1],
      time,
      points,
      originalPoints,
      part,
    })
  }

  return {
    entries,
    medianTime,
  }
}

export function prepareDayData(yearData, day, algo, users) {
  const dayData = yearData.entries[day]

  return {
    1: preparePartData(dayData["1"] ?? [], users, algo, 1),
    2: preparePartData(dayData["2"] ?? [], users, algo, 2),
    stats: dayData.stats,
  }
}
