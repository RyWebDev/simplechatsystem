import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>


      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  )
}
