'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';

interface DashLayoutProps {
  children: React.ReactNode;
}

export function DashLayout({ children }: DashLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background'>
          <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
          </div>
        </header>
        <div className='p-4 lg:p-6'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
