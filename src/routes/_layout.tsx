import axios from '@/api/axios'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { IoIosLogOut } from 'react-icons/io'
import { io } from 'socket.io-client'


export const Route = createFileRoute('/_layout')({
  component: () => <Authenticated />,
})

interface Userprops {
  id?: string
  name?: string
  email?: string
}

function Authenticated() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [user, setUser] = useState<Userprops>()
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get('api/user')
        setUser(res.data.user)
        if (res) {
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        navigate({ to: '/login' })
      }
    }

    getUser()
  }, [navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='bg-gray-100'>
      <Layout name={user?.name} />
    </div>
  )
}

function Layout({ name }: Userprops) {
  const navigate = useNavigate()

  const socket = useMemo(
    () => io('http://localhost:8081', { withCredentials: true }),
    []
  )

  const HandleLogout = async () => {
    try {
      socket.emit('logout')
      await axios.post('api/logout')
      navigate({ to: '/login' })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='flex justify-end p-5'>
        <span className='mr-5'>{name}</span>
        <button onClick={HandleLogout}>
          <IoIosLogOut className='size-6' />
        </button>
      </div>
      <br />
      <Outlet />
      
      <br />
    </>
  )
}
