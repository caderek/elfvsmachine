function addPositions(entries, pointsKey, posKey) {
  entries.sort((a, b) => b[pointsKey] - a[pointsKey])

  const withPos = []
  let pos = 0
  let jump = 1
  let prevPoints = -1

  for (const entry of entries) {
    if (entry[pointsKey] === prevPoints) {
      jump++
    } else {
      pos += jump
      jump = 1
    }

    withPos.push({
      [posKey]: pos,
      ...entry,
    })

    prevPoints = entry[pointsKey]
  }

  return withPos
}

export function prepareSummary(allEntries, users) {
  const byUsers = {}

  for (const {
    userId,
    points,
    originalPoints,
    part,
    timesOnLeaderboard,
  } of allEntries) {
    if (!byUsers[userId]) {
      byUsers[userId] = {
        ptsByDay: [],
        origPtsByDay: [],
        timesOnLeaderboard: { 1: 0, 2: 0 },
      }
    }

    byUsers[userId].ptsByDay.push(points)
    byUsers[userId].origPtsByDay.push(originalPoints)

    if (part) {
      byUsers[userId].timesOnLeaderboard[part]++
    } else if (timesOnLeaderboard) {
      byUsers[userId].timesOnLeaderboard[1] += timesOnLeaderboard[1]
      byUsers[userId].timesOnLeaderboard[2] += timesOnLeaderboard[2]
    }
  }

  const perUsers = []

  for (const [
    userId,
    { ptsByDay, origPtsByDay, timesOnLeaderboard },
  ] of Object.entries(byUsers)) {
    const points = ptsByDay.reduce((sum, entry) => sum + entry, 0)
    const originalPoints = origPtsByDay.reduce((sum, entry) => sum + entry, 0)
    perUsers.push({
      userId: Number(userId),
      user: users[userId][0],
      gh: users[userId][1],
      points,
      originalPoints,
      timesOnLeaderboard,
    })
  }

  const final = addPositions(
    addPositions(perUsers, "originalPoints", "originalPos"),
    "points",
    "pos",
  )

  return {
    first100: final.filter((x) => x.pos <= 100),
    others: final.filter((x) => x.pos > 100),
  }
}
