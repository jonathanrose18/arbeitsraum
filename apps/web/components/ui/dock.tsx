'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ className, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          'border-border bg-muted fixed bottom-4 left-1/2 z-40 flex min-w-24 -translate-x-1/2 flex-row items-center justify-center gap-3 rounded-2xl border px-2 py-2 dark:bg-black',
          className,
        )}
        {...props}
      />
    )
  },
)
Dock.displayName = 'Dock'

export interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center text-black/50 transition-all duration-500 hover:scale-110 group-hover:text-black dark:text-white/50 group-hover:dark:text-white',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  },
)
DockIcon.displayName = 'DockIcon'

const DockSeparator = () => (
  <div className='bg-border mx-1 h-4 w-px rounded-full dark:bg-white/50' />
)
DockSeparator.displayName = 'DockSeparator'

export { Dock, DockIcon, DockSeparator }
