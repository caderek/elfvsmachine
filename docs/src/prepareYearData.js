import { prepareDayData } from "./prepareDayData.js"
import { prepareSummary } from "./prepareSummary.js"

export function prepareYearData(yearData, algo, users) {
  const allEntries = Object.keys(yearData.entries)
    .map((day) =>
      Object.values(prepareDayData(yearData, day, algo, users))
        .slice(0, 2) // get rid of day stats
        .map((x) => x.entries),
    )
    .flat(2)

  return prepareSummary(allEntries, users)
}
