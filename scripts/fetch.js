import { fetchAll } from "./actions/fetchAll.js"
import { prepareData } from "./actions/prepareData.js"

async function main() {
  await fetchAll()
  prepareData()
}

main()
