import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default async function Home() {
  return (
    <main className='flex h-screen flex-col items-center justify-center'>
      <Button asChild variant='ghost'>
        <Link href='/~'>
          <span>Dashboard</span>
          <ArrowRightIcon />
        </Link>
      </Button>
    </main>
  )
}
