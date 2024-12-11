import { prepareSummary } from "./prepareSummary.js"
import { prepareYearData } from "./prepareYearData.js"

export function prepareAllTimeData(yearsData, algo, users) {
  const allEntries = yearsData
    .map((yearData) => Object.values(prepareYearData(yearData, algo, users)))
    .flat(2)

  return prepareSummary(allEntries, users)
}
