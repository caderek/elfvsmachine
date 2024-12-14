import { config } from "../../config.js"

export function fetchPub(url) {
  return fetch(url, {
    headers: {
      ...config.USER_AGENT_HEADER,
    },
  })
}

export async function fetchPriv(url, sessionKey) {
  const res = await fetch(url, {
    headers: {
      cookie: `session=${sessionKey}`,
      ...config.USER_AGENT_HEADER,
    },
  })

  if (!res.ok) {
    switch (res.status) {
      case 400:
      case 500:
        console.error(
          "INVALID SESSION\n\n" +
            "Please make sure that the session key in the .env file is correct.\n\n" +
            "You can find your session key in the 'session' cookie at:\n" +
            "https://adventofcode.com\n",
        )
        break
      default:
        console.error(
          `AoC server returned status ${res.status},\n` + "please try again.",
        )
    }
    process.exit(1)
  }

  return res
}

export function getSeconds(result) {
  const timeString = result.trim().split(/\s+/).at(-1)

  if (timeString === "-") {
    return null
  }

  if (timeString === ">24h") {
    return 24 * 60 * 60 + 1
  }

  const [h, m, s] = timeString.split(":").map(Number)
  return h * 60 * 60 + m * 60 + s
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
