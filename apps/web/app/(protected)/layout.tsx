import type { ReactNode } from 'react'

import { withAuth } from '@/hoc/with-auth'

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>
}

export default withAuth(Layout)
