import 'server-only'

import { APIError, betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { cache } from 'react'
import { headers } from 'next/headers'
import { nextCookies } from 'better-auth/next-js'
import { prismaAdapter } from '@better-auth/prisma-adapter'

import { prisma } from '@arbeitsraum/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  advanced: { cookiePrefix: 'arbeitsraum' },
  plugins: [nextCookies(), admin()],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const count = await prisma.user.count()
          if (count > 0) {
            throw new APIError('FORBIDDEN', {
              message: 'Registration is closed.',
            })
          }
          return { data: { ...user, role: 'admin' } }
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

export const getAuth = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
)
