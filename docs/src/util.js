export function secondsToTime(sec) {
  const h = Math.floor(sec / (60 * 60))
  const m = Math.floor((sec - h * 60 * 60) / 60)
  const s = sec - (h * 60 * 60 + m * 60)

  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].join(":")
}

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

export function formatNum(num) {
  return new Intl.NumberFormat("en-US").format(num)
}

/**
 * @param {Date} date
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatDiff(num) {
  if (num === 0) {
    return "—"
  }
  return new Intl.NumberFormat("en-US", { signDisplay: "always" }).format(num)
}
