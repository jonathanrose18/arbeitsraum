import { auth } from './'

export async function getSession(headers: Headers) {
  return auth.api.getSession({ headers })
}

export async function getUserFromSession(headers: Headers) {
  const session = await getSession(headers)
  return session?.user ?? null
}
