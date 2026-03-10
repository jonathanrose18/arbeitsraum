import { withAuth } from '@/hoc/with-auth'

async function Page() {
  return <div>Hello, from your arbeitsraum 👋</div>
}

export default withAuth(Page)
