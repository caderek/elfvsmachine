import fs from "node:fs"
import { fetchAllPriv } from "./actions/fetchAllPriv.js"

const sessionKey = process.argv[2] ?? process.env.AOC_SESSION_KEY ?? null

async function main() {
  if (!sessionKey) {
    console.error(
      "NO SESSION KEY PROVIDED\n\n" +
        "Please provide the key as an argument:\n" +
        "npm run priv <session_key>\n\n" +
        "Alternatively, you can set it as\n" +
        "an environment variable named AOC_SESSION_KEY\n\n" +
        "You can find your session key in the 'session' cookie at:\n" +
        "https://adventofcode.com\n",
    )
    return
  }

  await fetchAllPriv(sessionKey)

  console.log("Done!")
}

main()
