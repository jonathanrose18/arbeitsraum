import { ReactNode } from 'react'

import { withAuth } from '@/hoc/with-auth'

async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}

export default withAuth(Layout)
