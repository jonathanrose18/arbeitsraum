import { redirect } from 'next/navigation'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { getAuth } from '@/lib/auth'
import { withSuperUser } from '@/hoc/with-super-user'

async function SignInPage() {
  const auth = await getAuth()

  if (auth) {
    redirect('/')
  }

  return (
    <main className='flex min-h-screen items-center justify-center p-4'>
      <SignInForm />
    </main>
  )
}

export default withSuperUser(SignInPage)
