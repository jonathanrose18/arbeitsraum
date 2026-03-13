'use client'

import { Dock, DockIcon } from '@/components/ui/dock'
import { MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function AppDock() {
  const { setTheme } = useTheme()

  const onToggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <div className='fixed bottom-8 flex w-screen items-center justify-center'>
      <div>
        <Dock>
          <DockIcon onClick={onToggleTheme}>
            <MoonIcon />
          </DockIcon>
        </Dock>
      </div>
    </div>
  )
}
