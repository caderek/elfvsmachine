import { secondsToTime, formatNum, formatDiff } from "./util.js"
import { prepareYearData } from "./prepareYearData.js"
import { prepareDayData } from "./prepareDayData.js"
import { prepareAllTimeData } from "./prepareAllTimeData.js"
import { prepareUserYearData } from "./prepareUserYearData.js"
import { prepareUserAllTimeData } from "./prepareUserAllTimeData.js"

export const AlgoButton = ({ algo, disabled }) => `
  <li>
    <button ${disabled ? "disabled" : ""} data-algo="${algo}">${algo.toUpperCase()}</button>
  </li>
`

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

const PartView = ({ data, showDiff }) => {
  return data
    .map((entry) => {
      const gh = entry.gh
        ? `<a href="https://github.com/${entry.gh}" title="Visit Github profile">GH</a>`
        : ""

      const time = entry.time
        ? `<span class="time">${secondsToTime(entry.time)}</span>`
        : ""

      const diffVal = showDiff ? entry.originalPos - entry.pos : 0
      const diffClass = diffVal > 0 ? "good" : diffVal < 0 ? "bad" : ""

      const diff = showDiff
        ? `<span class="diff ${diffClass}">${formatDiff(diffVal)}</span>`
        : ""

      return `
        <li>
          <span class="position">${entry.pos}:</span>
          <span class="points">${formatNum(entry.points)}</span>
          ${time}
          <span class="user">
            <a class="profile" title="View user details" data-id="${entry.userId}" href="?profile=${entry.userId}">
              ${entry.user}
            </a> ${gh}</span>
          ${diff}
        </li>
      `
    })
    .join("")
}

export const DayView = ({ yearData, day, algo, users }) => {
  const data = prepareDayData(yearData, day, algo, users)
  const pointsWidth = Math.max(3, formatNum(data[2].entries[0].points).length)
  const style = `--points-w: ${pointsWidth}ch;`

  return `
    <section class="both-stars" style="${style}">
      <h2>Both Stars on <a href="https://adventofcode.com/${yearData.year}/day/${day}">Day ${day}, ${yearData.year}</a></h2>
      <div class="notes">
        <p>Median time: <strong>${secondsToTime(Math.round(data[2].medianTime))}</strong></p>
        <p>Finished by <strong>${formatNum(data.stats.both)}</strong> ${data.stats.both === 1 ? "person" : "people"}.</p>
      </div>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Pts</span>
          <span class="time">Time</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: data[2]?.entries ?? [] })}
      </ul>
    </section>
    <section class="first-star" style="${style}">
      <h2>First Star on <a href="https://adventofcode.com/${yearData.year}/day/${day}">Day ${day}, ${yearData.year}</a></h2>
      <div class="notes">
        <p>Median time: <strong>${secondsToTime(Math.round(data[1].medianTime))}</strong></p>
        <p>Finished by <strong>${formatNum(data.stats.first)}</strong> ${data.stats.first === 1 ? "person" : "people"}.</p>
      </div>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Pts</span>
          <span class="time">Time</span>
          <span class="user">User</span>
        </li>
        ${PartView({ data: data[1]?.entries ?? [] })}
      </ul>
    </section>
  `
}

export const YearView = ({ yearData, algo, users }) => {
  const { first100, others } = prepareYearData(yearData, algo, users)

  const pointsWidth = Math.max(3, formatNum(first100[0].points).length)
  const posWidth = Math.max(4, formatNum(others[others.length - 1].pos).length)
  const userWidth = Math.max(
    ...[...first100, ...others].map((x) => x.user.length + (x.gh ? 3 : 0)),
  )
  const style = `--points-w: ${pointsWidth}ch; --pos-w: ${posWidth}ch; --user-w: ${userWidth}ch`
  const showDiff = algo !== "original"

  const diffLabel = showDiff
    ? `<span class="diff" title="Change in comparison to the original leaderboard">Diff</span>`
    : ``

  return `
    <section class="first-100" style="${style}">
      <h2>Top 100 in <a href="https://adventofcode.com/${yearData.year}">${yearData.year}</a></h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
          ${diffLabel}
        </li>
        ${PartView({ data: first100, showDiff })}
      </ul>
    </section>
    <section class="others" style="${style}">
      <h2>Others with points</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
          ${diffLabel}
        </li>
        ${PartView({ data: others, showDiff })}
      </ul>
    </section>
  `
}

export const AllTimeView = ({ yearsData, algo, users }) => {
  const { first100, others } = prepareAllTimeData(yearsData, algo, users)

  const pointsWidth = Math.max(6, formatNum(first100[0].points).length)
  const posWidth = Math.max(4, formatNum(others[others.length - 1].pos).length)
  const userWidth = Math.max(
    ...[...first100, ...others].map((x) => x.user.length + (x.gh ? 3 : 0)),
  )
  const style = `--points-w: ${pointsWidth}ch; --pos-w: ${posWidth}ch; --user-w:${userWidth}ch`
  const showDiff = algo !== "original"

  const diffLabel = showDiff
    ? `<span class="diff" title="Change in comparison to the original leaderboard">Diff</span>`
    : ``

  return `
    <section class="first-100" style="${style}">
      <h2>Top 100 All Time</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
          ${diffLabel}
        </li>
        ${PartView({ data: first100, showDiff })}
      </ul>
    </section>
    <section class="others" style="${style}">
      <h2>Others with points</h2>
      <ul>
        <li>
          <span class="position">Pos:</span>
          <span class="points">Points</span>
          <span class="user">User</span>
          ${diffLabel}
        </li>
        ${PartView({ data: others, showDiff })}
      </ul>
    </section>
  `
}

const UserProfile = ({ info, title }) => {
  const user = info.gh
    ? `<a href="https://github.com/${info.gh}">${info.user}</a>`
    : info.user
  return `
    <section class="user-info">
      <h2>${title} for ${user}</h2>
    </section>
`
}

const UserSummary = ({ stats, period, posAdjective }) => {
  return stats
    ? `
    <div class="user-summary">
      <p>${posAdjective} Position: <strong>#${stats.pos}</strong></p>
      <p>Total Points: <strong>${formatNum(stats.points)}</strong></p>
    </div>
  `
    : `<p class="user-summary error">Didn't make the leaderboard on any ${period}.</p>`
}

const UserDays = ({ stats, year }) => {
  if (!stats) {
    return ``
  }

  const days = stats.map((entry, i) => {
    const day = i + 1
    const sum = (entry[1]?.points ?? 0) + (entry[2]?.points ?? 0)
    return `
      <tr>
        <td><a href="?year=${year}&day=${day}">${day}</a></td>
        <td>${entry[2]?.pos ? `<strong>#${entry[2]?.pos}</strong>` : "-"}</td>
        <td>${entry[2]?.time ? secondsToTime(entry[2].time) : "-"}</td>
        <td>${entry[2]?.points ? formatNum(entry[2].points) : "-"}</td>
        <td>${entry[1]?.pos ? `<strong>#${entry[1]?.pos}</strong>` : "-"}</td>
        <td>${entry[1]?.time ? secondsToTime(entry[1].time) : "-"}</td>
        <td>${entry[1]?.points ? formatNum(entry[1].points) : "-"}</td>
        <td>${sum ? formatNum(sum) : "-"}</td>
      </tr>`
  })

  return `
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <td rowspan="2">Day</td>
            <td colspan="3">2nd star</td>
            <td colspan="3">1st star</td>
            <td rowspan="2">Sum</td>
          </tr>
          <tr>
            <td>Pos</td>
            <td>Time</td>
            <td>Pts</td>
            <td>Pos</td>
            <td>Time</td>
            <td>Pts</td>
          </tr>
        </thead>
        <tbody>
          ${days.join("")}
        <tbody>
      </table>
    </div>
  `
}

const UserYears = ({ stats }) => {
  const years = Object.entries(stats)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, entry], i) => {
      return `
      <tr>
        <td><a href="?year=${year}&day=0">${year}</a></td>
        <td>${entry?.pos ? `<strong>#${entry.pos}</strong>` : "-"}</td>
        <td>${entry?.points ? formatNum(entry.points) : "-"}</td>
        <td>${entry?.timesOnLeaderboard[2] || "-"}</td>
        <td>${entry?.timesOnLeaderboard[1] || "-"}</td>
      </tr>`
    })

  return `
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <td rowspan="2">Year</td>
            <td rowspan="2">Pos</td>
            <td rowspan="2">Pts</td>
            <td colspan="2">Times in top 100</td>
          </tr>
          <tr>
            <td>2nd star</td>
            <td>1st star</td>
          </tr>
        </thead>
        <tbody>
          ${years.join("")}
        <tbody>
      </table>
    </div>
  `
}

export const UserYearView = ({ yearData, userId, algo, users }) => {
  const data = prepareUserYearData(yearData, userId, algo, users)
  const posAdjective =
    Object.values(yearData.entries).length === 25 ? "Final" : "Current"

  return `
    ${UserProfile({ info: data.info, title: `${yearData.year} stats` })}
    ${UserSummary({ stats: data.yearStats, period: "day", posAdjective })}
    ${UserDays({ stats: data.daysStats, year: yearData.year })}
    <p class="back"><a href="?algo=${algo}">&lt; Back to leaderboard</a></p>
  `
}

export const UserAllTimeView = ({ yearsData, userId, algo, users }) => {
  const data = prepareUserAllTimeData(yearsData, userId, algo, users)
  return `
    ${UserProfile({ info: data.info, title: `All time stats` })}
    ${UserSummary({ stats: data.allTimeStats, period: "year", posAdjective: "Total" })}
    ${UserYears({ stats: data.yearsStats })}
    <p class="back"><a href="?algo=${algo}">&lt; Back to leaderboard</a></p>
  `
}
