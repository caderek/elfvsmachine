import { prepareDayData } from "./prepareDayData.js"
import { prepareYearData } from "./prepareYearData.js"

export function prepareUserYearData(yearData, userId, algo, users) {
  const [user, gh] = users[userId]
  const { first100, others } = prepareYearData(yearData, algo, users)

  const yearStats =
    [...first100, ...others].find((entry) => entry.userId === userId) ?? null

  const daysStats = yearStats
    ? Object.keys(yearData.entries).map((day) => {
        const dayData = prepareDayData(yearData, day, algo, users)

        return {
          1:
            dayData[1].entries.find((entry) => entry.userId === userId) ?? null,
          2:
            dayData[2].entries.find((entry) => entry.userId === userId) ?? null,
        }
      })
    : null

  return {
    info: { userId, user, gh },
    yearStats,
    daysStats,
  }
}
