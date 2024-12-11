import { secondsToTime, formatNum } from "./util.js"
import { prepareYearData } from "./prepareYearData.js"
import { prepareDayData } from "./prepareDayData.js"
import { prepareAllTimeData } from "./prepareAllTimeData.js"
import { prepareUserYearData } from "./prepareUserYearData.js"
import { prepareUserAllTimeData } from "./prepareUserAllTimeData.js"

export const DayButton = ({ day, year, disabled }) => `
  <li>
    <button ${disabled ? "disabled" : ""} data-year="${year}" data-day="${day}">${day === 0 ? "ALL" : day}</button>
  </li>
`

export const YearButton = ({ year, disabled }) => `
  <li>
    <button ${disabled ? "disabled" : ""} data-year="${year}">${year === 0 ? "ALL TIME" : year}</button>
  </li>
`

export const Loading = () => `
  <section class="loading">Loading...</section>
`

const PartView = ({ data }) => {
  return data
    .map((entry) => {
      const gh = entry.gh
        ? `<a href="https://github.com/${entry.gh}">GH</a>`
        : ""

      return `
        <li>
          <span class="position">${entry.pos}:</span>
          <span class="points">${formatNum(entry.points)}</span>
          ${entry.time ? `<span class="time">${secondsToTime(entry.time)}` : ""}</span>
          <span class="user"><a class="profile" data-id="${entry.userId}" href="?profile=${entry.userId}">${entry.user}</a> ${gh}</span>
        </li>
      `
    })
    .join("")
}

export const DayView = ({ yearData, day, algo, users }) => {
  const data = prepareDayData(yearData, day, algo, users)

  return `
    <section class="both-stars">
      <h2>Both Stars on <a href="https://adventofcode.com/${yearData.year}/day/${day}">Day ${day}, ${yearData.year}</a></h2>
      <p class="median">Median time: <strong>${secondsToTime(Math.round(data[2].medianTime))}</strong></p>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="points">Time</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: data[2]?.entries ?? [] })}
      </ul>
    </section>
    <section class="first-star">
      <h2>First Star on <a href="https://adventofcode.com/${yearData.year}/day/${day}">Day ${day}, ${yearData.year}</a></h2>
      <p class="median">Median time: <strong>${secondsToTime(Math.round(data[1].medianTime))}</strong></p>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="points">Time</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: data[1]?.entries ?? [] })}
      </ul>
    </section>
  `
}

export const YearView = ({ yearData, algo, users }) => {
  const { first100, others } = prepareYearData(yearData, algo, users)

  const pointsWidth = Math.max(6, formatNum(first100[0].points).length)
  const posWidth = Math.max(4, formatNum(others[others.length - 1].pos).length)
  const style = `--points-w: ${pointsWidth}ch; --pos-w: ${posWidth}ch`

  return `
    <section class="first-100" style="${style}">
      <h2>Top 100 in <a href="https://adventofcode.com/${yearData.year}">${yearData.year}</a></h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: first100 })}
      </ul>
    </section>
    <section class="others" style="${style}">
      <h2>Others with points</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: others })}
      </ul>
    </section>
  `
}

export const AllTimeView = ({ yearsData, algo, users }) => {
  const { first100, others } = prepareAllTimeData(yearsData, algo, users)

  const pointsWidth = Math.max(6, formatNum(first100[0].points).length)
  const posWidth = Math.max(4, formatNum(others[others.length - 1].pos).length)
  const style = `--points-w: ${pointsWidth}ch; --pos-w: ${posWidth}ch`

  return `
    <section class="first-100" style="${style}">
      <h2>Top 100 All Time</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: first100 })}
      </ul>
    </section>
    <section class="others" style="${style}">
      <h2>Others with points</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: others })}
      </ul>
    </section>
  `
}

export const UserYearView = ({ yearData, userId, algo, users }) => {
  const data = prepareUserYearData(yearData, userId, algo, users)
  console.log(data)
  return `User year data`
}

export const UserAllTimeView = ({ yearsData, userId, algo, users }) => {
  const data = prepareUserAllTimeData(yearsData, userId, algo, users)
  console.log(data)
  return `User all time data`
}
