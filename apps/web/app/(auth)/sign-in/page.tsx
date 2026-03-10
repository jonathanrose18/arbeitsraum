import { SignInForm } from '@/features/auth/components/sign-in-form'
import { withSuperUser } from '@/hoc/with-super-user'

function SignInPage() {
  return (
    <main className='flex min-h-screen items-center justify-center p-4'>
      <SignInForm />
    </main>
  )
}

export default withSuperUser(SignInPage)
