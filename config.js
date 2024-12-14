import path from "node:path"

const PUBLIC_DIR = "docs"
const USER_AGENT_HEADER = {
  "User-Agent": "github.com/caderek/elfvsmachine by maciej.caderek@gmail.com",
}

export const config = {
  RAW_DATA_DIR: "raw_data",
  PUBLIC_DIR,
  DATA_DIR: path.join(PUBLIC_DIR, "data"),
  DATA_PRIV_DIR: path.join(PUBLIC_DIR, "data-priv"),
  START_FROM_YEAR: 2015,
  DAYS_IN_EVENT: 25,
  USER_AGENT_HEADER,
}
