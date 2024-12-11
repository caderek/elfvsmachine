import { prepareYearData } from "./prepareYearData.js"

export function prepareUserYearData(yearData, algo, userId) {
  console.log({ yearData, algo, userId })
  const { first100, others } = prepareYearData(yearData, algo)
  console.log({ first100, others })

  const yearStats =
    [...first100, others].find((entry) => entry.userId === userId) ?? null

  console.log({ userId, yearStats })

  return {}
}
