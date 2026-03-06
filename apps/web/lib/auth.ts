import 'server-only'

import { betterAuth } from 'better-auth'
import { cache } from 'react'
import { headers } from 'next/headers'
import { nextCookies } from 'better-auth/next-js'
import { prismaAdapter } from '@better-auth/prisma-adapter'

import { prisma } from '@arbeitsraum/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  advanced: { cookiePrefix: 'arbeitsraum' },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

export const getAuth = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
)
