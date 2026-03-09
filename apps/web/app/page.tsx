'use client'

import { ThemeChanger } from '@/components/theme-changer'

const colors = [
  { name: 'background', var: '--background' },
  { name: 'foreground', var: '--foreground' },
  { name: 'card', var: '--card' },
  { name: 'card-foreground', var: '--card-foreground' },
  { name: 'popover', var: '--popover' },
  { name: 'popover-foreground', var: '--popover-foreground' },
  { name: 'primary', var: '--primary' },
  { name: 'primary-foreground', var: '--primary-foreground' },
  { name: 'secondary', var: '--secondary' },
  { name: 'secondary-foreground', var: '--secondary-foreground' },
  { name: 'muted', var: '--muted' },
  { name: 'muted-foreground', var: '--muted-foreground' },
  { name: 'accent', var: '--accent' },
  { name: 'accent-foreground', var: '--accent-foreground' },
  { name: 'destructive', var: '--destructive' },
  { name: 'destructive-foreground', var: '--destructive-foreground' },
  { name: 'border', var: '--border' },
  { name: 'input', var: '--input' },
  { name: 'ring', var: '--ring' },
  { name: 'chart-1', var: '--chart-1' },
  { name: 'chart-2', var: '--chart-2' },
  { name: 'chart-3', var: '--chart-3' },
  { name: 'chart-4', var: '--chart-4' },
  { name: 'chart-5', var: '--chart-5' },
  { name: 'sidebar', var: '--sidebar' },
  { name: 'sidebar-foreground', var: '--sidebar-foreground' },
  { name: 'sidebar-primary', var: '--sidebar-primary' },
  { name: 'sidebar-primary-foreground', var: '--sidebar-primary-foreground' },
  { name: 'sidebar-accent', var: '--sidebar-accent' },
  { name: 'sidebar-accent-foreground', var: '--sidebar-accent-foreground' },
  { name: 'sidebar-border', var: '--sidebar-border' },
  { name: 'sidebar-ring', var: '--sidebar-ring' },
]

export const force = 'dynamic'

export default function Page() {
  return (
    <div className='bg-background min-h-screen p-8'>
      <ThemeChanger />
      <div className='mt-8 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4'>
        {colors.map(({ name, var: cssVar }) => (
          <div key={name} className='flex flex-col gap-1'>
            <div
              className='border-border h-16 w-full rounded border'
              style={{ background: `var(${cssVar})` }}
            />
            <span className='text-muted-foreground text-xs'>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
