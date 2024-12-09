export function prepareYearData(yearData, day) {
  console.log(yearData)

  const allEntries = Object.values(yearData.days)
    .map((day) => [...(day["1"] ?? []), ...(day["2"] ?? [])])
    .flat()

  const byUsers = {}

  for (const [_, userId, sec, points] of allEntries) {
    if (!byUsers[userId]) {
      byUsers[userId] = []
    }

    byUsers[userId].push({ sec, points })
  }

  const perUsers = []

  for (const [userId, entries] of Object.entries(byUsers)) {
    const points = entries.reduce((sum, entry) => sum + entry.points, 0)
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
      user: yearData.users[userId][0],
      link: yearData.users[userId][1],
      points: new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(points),
    })

    prevPoints = points
  }

  return {
    first100: final.slice(0, 100),
    others: final.slice(100),
  }
}
