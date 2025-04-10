
import axios from '@/api/axios'
import { createFileRoute, Outlet, ReactNode, useNavigate } from '@tanstack/react-router'

import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_guest')({
  component: () => (
    <Guest>
    <GuestLayout />
    </Guest>
  )
})


function Guest({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get('api/user')
        if (res) {
          navigate({ to: '/chats' })
        }
      } catch (error) {
        setIsLoading(false)
      }
    }

    getUser()
  }, [navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}

function GuestLayout() {
  return (
    <>
      <br />
      <Outlet />
    </>
  )
}
