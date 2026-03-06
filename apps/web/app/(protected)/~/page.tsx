import { redirect, RedirectType } from 'next/navigation'

import { getAuth } from '@/lib/auth'
import { withAuth } from '@/hoc/with-auth'

async function Page() {
  const auth = await getAuth()

  if (!auth) {
    redirect('/auth/sign-in', RedirectType.replace)
  }

  return <div>Hello, from your arbeitsraum 👋</div>
}

export default withAuth(Page)
