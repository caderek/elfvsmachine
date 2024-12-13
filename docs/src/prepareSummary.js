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

  for (const { userId, points, originalPoints } of allEntries) {
    if (!byUsers[userId]) {
      byUsers[userId] = { ptsByDay: [], origPtsByDay: [] }
    }

    byUsers[userId].ptsByDay.push(points)
    byUsers[userId].origPtsByDay.push(originalPoints)
  }

  const perUsers = []

  for (const [userId, { ptsByDay, origPtsByDay }] of Object.entries(byUsers)) {
    const points = ptsByDay.reduce((sum, entry) => sum + entry, 0)
    const originalPoints = origPtsByDay.reduce((sum, entry) => sum + entry, 0)
    perUsers.push({
      userId: Number(userId),
      user: users[userId][0],
      gh: users[userId][1],
      points,
      originalPoints,
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
