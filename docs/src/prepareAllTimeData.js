import { prepareSummary } from "./prepareSummary.js"
import { prepareYearData } from "./prepareYearData.js"

export function prepareAllTimeData(yearsData, algo) {
  const allEntries = yearsData
    .map((yearData) => Object.values(prepareYearData(yearData, algo)))
    .flat(2)

  const users = yearsData
    .map((data) => data.users)
    .reduce((allUsers, yearUsers) => ({ ...allUsers, ...yearUsers }), {})

  return prepareSummary(allEntries, users)
}
