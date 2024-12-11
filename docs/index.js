import { getIndex } from "./src/getIndex.js"
import { getYearData } from "./src/getYearData.js"
import {
  DayView,
  YearView,
  AllTimeView,
  DayButton,
  YearButton,
  Loading,
  UserYearView,
  UserAllTimeView,
} from "./src/views.js"
import { initQueryString } from "./src/url.js"
import { getUsers } from "./src/getUsers.js"

const $years = document.querySelector("#years")
const $days = document.querySelector("#days")
const $main = document.querySelector("main")

async function load({ year, day, profile, algo, index, users, query }) {
  query.year = year
  query.day = day
  query.profile = profile

  $years.innerHTML = [0, ...Object.keys(index).map(Number)]
    .sort((a, b) => b - a)
    .map((y) => YearButton({ year: y, disabled: y === year }))
    .join("")

  $days.innerHTML =
    year === 0 || profile !== null
      ? ""
      : [0, ...Array.from({ length: index[year] }, (_, i) => i + 1)]
          .map((d) => DayButton({ day: d, year, disabled: d === day }))
          .join("")

  if (year === 0) {
    const yearsData = await Promise.all(Object.keys(index).map(getYearData))

    if (profile !== null) {
      $main.innerHTML = UserAllTimeView({
        yearsData,
        userId: profile,
        algo,
        users,
      })
      return
    }

    $main.innerHTML = AllTimeView({ yearsData, algo, users })
    return
  }

  const yearData = await getYearData(year)

  if (profile !== null) {
    $main.innerHTML = UserYearView({
      yearData,
      userId: profile,
      algo,
      users,
    })
    return
  }

  if (day === 0) {
    $main.innerHTML = YearView({ yearData, algo, users })
    return
  }

  $main.innerHTML = DayView({ yearData, day, algo, users })
}

async function main() {
  const index = await getIndex()
  const users = await getUsers()
  const query = initQueryString(index)
  const initialAlgo = "median"

  await load({
    year: query.year,
    day: query.day,
    profile: query.profile,
    algo: initialAlgo,
    index,
    users,
    query,
  })

  $years.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)

    $main.innerHTML = Loading()
    load({
      year,
      day: 0,
      profile: query.profile,
      algo: initialAlgo,
      index,
      users,
      query,
    })
  })

  $days.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)
    const day = Number(target.dataset.day)

    $main.innerHTML = Loading()
    load({
      year,
      day,
      profile: query.profile,
      algo: initialAlgo,
      index,
      users,
      query,
    })
  })

  $main.addEventListener("click", (e) => {
    if (
      !e.target.tagName ||
      e.target?.tagName.toLowerCase() !== "a" ||
      !e.target.classList.contains("profile")
    ) {
      return
    }

    e.preventDefault()

    const profile = e.target.dataset.id
    load({
      year: query.year,
      day: 0,
      profile,
      algo: initialAlgo,
      index,
      users,
      query,
    })
  })
}

main()
