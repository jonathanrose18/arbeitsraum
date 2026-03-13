import Link from 'next/link'

import { Logo } from './logo'

export function AppSidebarLogo() {
  return (
    <Link
      className='flex w-full items-center overflow-hidden transition-opacity hover:opacity-75'
      href='/'
    >
      <Logo size='small' variant='full' />
    </Link>
  )
}
