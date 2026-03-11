import { withAuth } from '@/hoc/with-auth'

export const force = 'dynamic'

async function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <span>
        Hello, from your arbeitsraum{' '}
        <span className='animate-wave inline-block origin-[70%_80%]'>👋</span>
      </span>
    </div>
  )
}

export default withAuth(Page)
