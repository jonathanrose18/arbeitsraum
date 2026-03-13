'use client'

import * as React from 'react'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'

import { AppSidebarFooter } from './app-sidebar-footer'
import { AppSidebarLogo } from './app-sidebar-logo'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <AppSidebarLogo />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  )
}
