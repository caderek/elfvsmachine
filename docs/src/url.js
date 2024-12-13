export function initQueryString(index) {
  const url = new URL(window.location.href)
  const years = new Set(Object.keys(index).map(Number))
  const defaultYear = Math.max(...years)

  return {
    get algo() {
      const algo = url.searchParams.get("algo")

      if (algo === null) {
        return "median"
      }

      return ["inverse", "original"].includes(algo) ? algo : "median"
    },

    get year() {
      const year = url.searchParams.get("year")

      if (year === null) {
        return defaultYear
      }

      const val = Number(year)
      return val === 0 || years.has(val) ? val : defaultYear
    },

    get day() {
      const year = this.year
      const day = Number(url.searchParams.get("day"))
      return day > 0 && day <= index[year] ? day : 0
    },

    get profile() {
      const profile = url.searchParams.get("profile")
      return profile ? Number(profile) : null
    },

    set algo(val) {
      if (["inverse", "original"].includes(val)) {
        url.searchParams.set("algo", val)
      } else {
        url.searchParams.delete("algo")
      }
      window.history.pushState(null, "", url.toString())
    },

    set year(val) {
      url.searchParams.set("year", val)
      window.history.pushState(null, "", url.toString())
    },

    set day(val) {
      url.searchParams.set("day", val)
      window.history.pushState(null, "", url.toString())
    },

    set profile(val) {
      if (val !== null) {
        url.searchParams.set("profile", val)
      } else {
        url.searchParams.delete("profile")
      }
      window.history.pushState(null, "", url.toString())
    },
  }
}
