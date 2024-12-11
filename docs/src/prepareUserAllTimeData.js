import { prepareAllTimeData } from "./prepareAllTimeData.js"
import { prepareYearData } from "./prepareYearData.js"

export function prepareUserAllTimeData(yearsData, userId, algo, users) {
  const [user, gh] = users[userId]
  const { first100, others } = prepareAllTimeData(yearsData, algo, users)

  const allTimeStats =
    [...first100, ...others].find((entry) => entry.userId === userId) ?? null

  const yearsStats = yearsData.map((yearData) => {
    const { first100, others } = prepareYearData(yearData, algo, users)
    const yearStats =
      [...first100, ...others].find((entry) => entry.userId === userId) ?? null

    return [yearData.year, yearStats ?? null]
  })

  return {
    info: { userId, user, gh },
    allTimeStats,
    yearsStats: Object.fromEntries(yearsStats),
  }
}
