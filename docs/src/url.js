export function initQueryString(index) {
  const url = new URL(window.location.href)
  const years = new Set(Object.keys(index).map(Number))
  const defaultYear = Math.max(...years)

  return {
    get year() {
      const year = url.searchParams.get("year")

      if (year === null) {
        return defaultYear
      }

      const val = Number(year)
      return years.has(val) ? val : defaultYear
    },

    get day() {
      const year = this.year
      const day = Number(url.searchParams.get("day"))
      return day > 0 && day <= index[year] ? day : 0
    },

    set year(val) {
      url.searchParams.set("year", val)
      window.history.pushState(null, "", url.toString())
    },

    set day(val) {
      url.searchParams.set("day", val)
      window.history.pushState(null, "", url.toString())
    },
  }
}
