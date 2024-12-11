export function prepareSummary(allEntries, users) {
  const byUsers = {}

  for (const { userId, points } of allEntries) {
    if (!byUsers[userId]) {
      byUsers[userId] = []
    }

    byUsers[userId].push(points)
  }

  const perUsers = []

  for (const [userId, entries] of Object.entries(byUsers)) {
    const points = entries.reduce((sum, entry) => sum + entry, 0)
    perUsers.push({
      userId,
      points,
    })
  }

  perUsers.sort((a, b) => b.points - a.points)

  const final = []
  let pos = 0
  let jump = 1
  let prevPoints = -1

  for (const { userId, points } of perUsers) {
    if (points === prevPoints) {
      jump++
    } else {
      pos += jump
      jump = 1
    }

    final.push({
      pos,
      userId,
      user: users[userId][0],
      gh: users[userId][1],
      points,
    })

    prevPoints = points
  }

  return {
    first100: final.filter((x) => x.pos <= 100),
    others: final.filter((x) => x.pos > 100),
  }
}
