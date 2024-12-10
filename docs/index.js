import { getIndex } from "./src/getIndex.js"
import { getYearData } from "./src/getYearData.js"
import {
  DayView,
  YearView,
  AllTimeView,
  DayButton,
  YearButton,
  Loading,
} from "./src/views.js"
import { initQueryString } from "./src/url.js"

const $years = document.querySelector("#years")
const $days = document.querySelector("#days")
const $main = document.querySelector("main")

async function load(year, day, algo, index, query) {
  query.year = year
  query.day = day

  $years.innerHTML = [0, ...Object.keys(index).map(Number)]
    .sort((a, b) => b - a)
    .map((y) => YearButton({ year: y, disabled: y === year }))
    .join("")

  $days.innerHTML =
    year === 0
      ? ""
      : [0, ...Array.from({ length: index[year] }, (_, i) => i + 1)]
          .map((d) => DayButton({ day: d, year, disabled: d === day }))
          .join("")

  if (year === 0) {
    const yearsData = await Promise.all(Object.keys(index).map(getYearData))
    $main.innerHTML = AllTimeView({ yearsData, algo })
    return
  }

  const yearData = await getYearData(year)

  $main.innerHTML =
    day === 0
      ? YearView({ yearData, year, algo })
      : DayView({ yearData, year, day, algo })
}

async function main() {
  const index = await getIndex()
  const query = initQueryString(index)
  const initialAlgo = "median"

  await load(query.year, query.day, initialAlgo, index, query)

  $years.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)

    $main.innerHTML = Loading()
    load(year, 0, initialAlgo, index, query)
  })

  $days.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)
    const day = Number(target.dataset.day)

    $main.innerHTML = Loading()
    load(year, day, initialAlgo, index, query)
  })
}

main()
