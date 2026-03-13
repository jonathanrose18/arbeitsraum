import { useMemo } from 'react'

const iconSizeMap = {
  small: 24,
  default: 32,
  large: 48,
}

const textSizeClasses = {
  small: 'text-base',
  default: 'text-xl',
  large: 'text-3xl',
}

export function Logo({
  size = 'default',
  variant = 'full',
}: {
  size?: 'small' | 'default' | 'large'
  variant?: 'full' | 'icon'
}) {
  const iconSize = useMemo(() => iconSizeMap[size], [size])

  return (
    <div className='flex items-center gap-1.5'>
      <svg
        viewBox='0 0 20 22'
        fill='none'
        className='shrink-0'
        height={iconSize}
        width={iconSize}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M4 0H16L12 8H0L4 0Z'
          fill='currentColor'
          className='text-foreground'
        />
        <path
          d='M6 10H20L16 22H2L6 10Z'
          fill='currentColor'
          className='text-foreground'
        />
      </svg>

      {variant === 'full' && (
        <span
          className={`${textSizeClasses[size]} text-foreground font-medium tracking-tight`}
        >
          arbeitsraum
        </span>
      )}
    </div>
  )
}
