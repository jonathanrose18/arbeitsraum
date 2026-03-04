import { prismaAdapter } from '@better-auth/prisma-adapter'

import { prisma } from '@arbeitsraum/db'

export const baseConfig = {
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: 'arbeitsraum',
  },
} as const
