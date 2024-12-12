let cache = null

export async function getUsers(lastUpdate) {
  if (cache) {
    return cache
  }

  const res = await fetch(`data/users-${lastUpdate}.json`)
  const users = await res.json()
  cache = users

  return users
}
