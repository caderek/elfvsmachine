import { secondsToTime } from "./util.js"

function preparePartData(partData, users) {
  return partData.map(([pos, userId, sec, points]) => ({
    pos,
    user: users[userId][0],
    link: users[userId][1],
    time: secondsToTime(sec),
    points: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(points),
  }))
}

export function prepareDayData(yearData, day) {
  const dayData = yearData.days[day]

  return {
    1: preparePartData(dayData["1"] ?? [], yearData.users),
    2: preparePartData(dayData["2"] ?? [], yearData.users),
  }
}
