import 'server-only'

import { createElement, type JSX } from 'react'
import { redirect, RedirectType } from 'next/navigation'

import { prisma } from '@arbeitsraum/db'

export function withSuperUser<P extends object>(
  Component: (props: P) => Promise<JSX.Element | null> | JSX.Element | null,
) {
  return async function AuthenticatedComponent(props: P) {
    const userCount = await prisma.user.count({ take: 1 })

    if (userCount < 1) {
      redirect('sign-up', RedirectType.replace)
    }

    return createElement(Component, {
      ...props,
    })
  }
}
