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
