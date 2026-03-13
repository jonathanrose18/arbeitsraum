import { withAuth } from '@/hoc/with-auth'

export const force = 'dynamic'

async function Page() {
  return null
}

export default withAuth(Page)
