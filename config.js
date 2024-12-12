import path from "node:path"

const PUBLIC_DIR = "docs"

export const config = {
  RAW_DATA_DIR: "raw_data",
  PUBLIC_DIR,
  DATA_DIR: path.join(PUBLIC_DIR, "data"),
  START_FROM_YEAR: 2015,
  DAYS_IN_EVENT: 25,
}
