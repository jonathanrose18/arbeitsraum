'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeChanger() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className='flex flex-col gap-2'>
      <span>The current theme is: {theme}</span>
      <div>
        <button
          className='disabled:opacity-50'
          disabled={theme === 'light'}
          onClick={() => setTheme('light')}
        >
          Change to Light Mode
        </button>
      </div>
      <div>
        <button
          className='disabled:opacity-50'
          disabled={theme === 'dark'}
          onClick={() => setTheme('dark')}
        >
          Change to Dark Mode
        </button>
      </div>
    </div>
  )
}
