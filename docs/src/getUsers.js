let cache = null

export async function getUsers() {
  if (cache) {
    return cache
  }

  const res = await fetch("data/users.json")
  const users = await res.json()
  cache = users

  return users
}
