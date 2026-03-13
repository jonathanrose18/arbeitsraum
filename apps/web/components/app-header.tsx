import { Fragment } from 'react'

export function AppHeader() {
  return (
    <Fragment>
      <header className='backdrop-blur-xs fixed z-10 flex h-14 w-full items-center border-b px-4'>
        <span>
          Hello, from your arbeitsraum{' '}
          <span className='animate-wave inline-block origin-[70%_80%]'>👋</span>
        </span>
      </header>
      <div className='h-14' />
    </Fragment>
  )
}
