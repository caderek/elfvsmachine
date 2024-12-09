import { prepareDayData } from "./prepareDayData.js"
import { prepareSummary } from "./prepareSummary.js"

export function prepareYearData(yearData, algo) {
  const allEntries = Object.keys(yearData.days)
    .map((day) =>
      Object.values(prepareDayData(yearData, day, algo)).map((x) => x.entries),
    )
    .flat(2)

  return prepareSummary(allEntries, yearData.users)
}
