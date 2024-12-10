export function calculateMedian(values) {
  if (values.length === 0) {
    return 0
  }

  values = [...values].sort((a, b) => a - b)

  const half = Math.floor(values.length / 2)

  return values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2
}

export function getCurrent() {
  const now = new Date()

  // UTC-5 as AoC starts
  const timeZone = "America/New_York"

  const yearFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone,
  })

  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    timeZone,
  })

  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone,
  })

  const month = Number(monthFormatter.format(now))
  const day = Number(dayFormatter.format(now))

  return {
    currentYear: Number(yearFormatter.format(now)),
    currentDay: month === 12 ? day : 0,
  }
}
