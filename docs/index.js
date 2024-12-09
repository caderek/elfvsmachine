import { getIndex } from "./src/getIndex.js"
import { getYearData } from "./src/getYearData.js"
import { prepareDayData } from "./src/prepareDayData.js"
import { prepareYearData } from "./src/prepareYearData.js"

const $years = document.querySelector("#years")
const $days = document.querySelector("#days")
const $main = document.querySelector("main")

const DayButton = ({ day, year, disabled }) => `
  <li>
    <button ${disabled ? "disabled" : ""} data-year="${year}" data-day="${day}">${day === 0 ? "ALL" : day}</button>
  </li>
`

const YearButton = ({ year, disabled }) => `
  <li>
    <button ${disabled ? "disabled" : ""} data-year="${year}">${year}</button>
  </li>
`

const AllView = ({ yearData }) => {
  const { first100, others } = prepareYearData(yearData)

  first100.unshift({ pos: "Pos", user: "User", points: "Points" })
  others.unshift({ pos: "Pos", user: "User", points: "Points" })

  return `
    <section class="both-stars">
      <h2>Top 100</h2>
      <ul>${PartView({ data: first100 })}</ul>
    </section>
    <section class="first-star">
      <h2>Others with points</h2>
      <ul>${PartView({ data: others })}</ul>
    </section>
  `
}

const isExternalLink = (link) => {
  return link && link.startsWith("http")
}

const PartView = ({ data }) => {
  return data
    .map((entry) => {
      const name = entry.user
        .replace("(AoC++)", "")
        .replace(" (Sponsor)", "")
        .trim()

      const user = isExternalLink(entry.link)
        ? `<a href="${entry.link}">${name}</a>`
        : name

      return `
        <li>
          <span class="position">${entry.pos}:</span>
          <span class="points">${entry.points}</span>
          ${entry.time ? `<span class="time">${entry.time}` : ""}</span>
          <span class="user">${user}</span>
        </li>
      `
    })
    .join("")
}

const DayView = ({ yearData, day }) => {
  const data = prepareDayData(yearData, day)

  data[2].unshift({ pos: "Pos", user: "User", time: "Time", points: "Points" })
  data[1].unshift({ pos: "Pos", user: "User", time: "Time", points: "Points" })

  return `
    <section class="both-stars">
      <h2>Both Stars</h2>
      <ul>${PartView({ data: data[2] ?? [] })}</ul>
    </section>
    <section class="first-star">
      <h2>First Star</h2>
      <ul>${PartView({ data: data[1] ?? [] })}</ul>
    </section>
  `
}

const Loading = () => `
  <section class="loading">Loading...</section>
`

async function load(year, day, index) {
  $years.innerHTML = Object.keys(index)
    .map(Number)
    .sort((a, b) => b - a)
    .map((y) => YearButton({ year: y, disabled: y === year }))
    .join("")

  $days.innerHTML = [0, ...Array.from({ length: index[year] }, (_, i) => i + 1)]
    .map((d) => DayButton({ day: d, year, disabled: d === day }))
    .join("")

  const yearData = await getYearData(year)

  if (day === 0) {
    $main.innerHTML = AllView({ yearData })
  } else {
    $main.innerHTML = DayView({ yearData, day })
  }
}

async function main() {
  const index = await getIndex()
  const initialYear = Math.max(...Object.keys(index).map(Number))
  const initialDay = 0

  await load(initialYear, initialDay, index)

  $years.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)

    $main.innerHTML = Loading()
    load(year, 0, index)
  })

  $days.addEventListener("click", (e) => {
    if (!e.target.tagName || e.target?.tagName.toLowerCase() !== "button") {
      return
    }

    const target = e.target
    const year = Number(target.dataset.year)
    const day = Number(target.dataset.day)

    $main.innerHTML = Loading()
    load(year, day, index)
  })
}

main()
