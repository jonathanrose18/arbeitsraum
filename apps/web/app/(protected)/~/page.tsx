import { AppHeader } from '@/components/app-header'
import { withAuth } from '@/hoc/with-auth'

export const force = 'dynamic'

async function Page() {
  return (
    <div>
      <AppHeader />
      <main>{null}</main>
    </div>
  )
}

export default withAuth(Page)
