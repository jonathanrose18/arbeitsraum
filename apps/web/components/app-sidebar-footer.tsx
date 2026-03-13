import { BugIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { SidebarFooter } from './ui/sidebar'
import { Switch } from './ui/switch'

export function AppSidebarFooter() {
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark'

  const onModeSwitch = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <SidebarFooter>
      <p className='text-muted-foreground/75 text-xs font-bold'>Others</p>

      <div>
        <a
          className='group/bug flex items-center gap-2'
          href='https://github.com/jonathanrose18/arbeitsraum/issues/new'
          rel='noopener noreferrer'
          target='_blank'
        >
          <BugIcon className='size-3 group-hover/bug:opacity-75' />
          <span className='text-muted-foreground text-xs group-hover/bug:opacity-75'>
            Report a bug
          </span>
        </a>
      </div>
      <div className='flex items-center'>
        <label
          className='group/theme-switch flex cursor-pointer items-center gap-2'
          htmlFor='theme-switch'
        >
          <MoonIcon className='size-3 group-hover/theme-switch:opacity-75' />
          <span className='text-muted-foreground text-xs group-hover/theme-switch:opacity-75'>
            Dark mode
          </span>
        </label>
        <Switch
          className='ml-auto cursor-pointer'
          id='theme-switch'
          checked={isDarkMode}
          size='sm'
          onCheckedChange={onModeSwitch}
        />
      </div>
    </SidebarFooter>
  )
}
