import { secondsToTime, calculateMedian } from "./util.js"

function preparePartData(partData, users, algo) {
  const medianTime = calculateMedian(partData.map(([_, sec]) => sec))

  const entries = []

  let pos = 0
  let jump = 1
  let prevTime = -1

  for (const [i, [userId, time]] of partData.entries()) {
    if (time === prevTime) {
      jump++
    } else {
      pos += jump
      jump = 1
    }

    let points =
      algo === "inverse"
        ? partData[partData.length - i - 1][1]
        : Math.max(1, Math.round(((101 - pos) / 100) * medianTime))

    entries.push({
      pos,
      userId,
      user: users[userId][0],
      link: users[userId][1],
      time,
      points,
    })

    prevTime = time
  }

  return {
    entries,
    medianTime,
  }
}

export function prepareDayData(yearData, day, algo) {
  const dayData = yearData.days[day]

  return {
    1: preparePartData(dayData["1"] ?? [], yearData.users, algo),
    2: preparePartData(dayData["2"] ?? [], yearData.users, algo),
  }
}
