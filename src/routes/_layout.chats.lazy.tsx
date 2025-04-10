import axios from '@/api/axios'
import { Button } from '@/components/ui/button'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { toast, Toaster } from 'sonner'

export const Route = createLazyFileRoute('/_layout/chats')({
  component: ChatApp,
})

interface Users {
  id: string
  name: string
  email: string
}

function ChatApp() {
  const [users, setUsers] = useState<Users[]>([])

  const [authUser, setAuthUser] = useState<Users | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const socket = useMemo(
    () => io('http://localhost:8081', { withCredentials: true }),
    []
  )

  useEffect(() => {
    socket.on('connect', () => {
      // Any additional connection logic

      socket.on('online-users', (online) => {
        setOnlineUsers(Object.keys(online))
      })
    })
  })

  useEffect(() => {
    const fetchusers = async () => {
      const res = await axios.get('api/users')
      setUsers(res.data)
    }

    const fetchuser = async () => {
      const res = await axios.get('api/user')
      setAuthUser(res.data.user)
    }

    fetchusers()
    fetchuser()
  }, [])

  const getIntialLetters = (fullname: string) => {
    let name = fullname.trim().split(' ')

    let firstName = name[0]
    let lastName = name[name.length - 1]

    return (
      firstName.charAt(0).toLocaleUpperCase() +
      lastName.charAt(0).toLocaleUpperCase()
    )
  }

  return (
    <>
      <div className='bg-gray-100 max-w-6xl mx-auto my-16'>
        {/* <button
          onClick={() =>
            toast(`Ryan Panarigan\nSent you a message.`, {
              action: {
                label: 'View',
                onClick: () => console.log('Undo'),
              },
              position: 'bottom-center',
              style: {
                whiteSpace: 'pre-line'
              }
            })
          }
        >
          Click
        </button> */}
        <h5 className='text-center text-2xl font-bold py-3'>Friends</h5>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-2'>
          {users
            .filter((user) => user.id !== authUser?.id)
            .map((user, i) => (
              <div
                key={i}
                className='w-full bg-white border border-gray-200 rounded-lg p-5 shadow'
              >
                <div className='flex flex-col items-center pb-10'>
                  {/* <img
                    src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                    alt='image'
                    className='w-24 h-24 mb-2 rounded-full shadow-lg'
                  /> */}
                  <div className='w-24 h-24 mb-2 rounded-full shadow-lg bg-slate-100 flex justify-center items-center'>
                    <span className='text-3xl font-mono font-semibold'>
                      {getIntialLetters(user?.name)}
                    </span>
                  </div>

                  <h5 className='mb-1 text-xl font-medium text-gray-900 '>
                    {user.name}
                  </h5>
                  <span className='text-sm text-gray-500'>
                    {onlineUsers.includes(`${user.id}`) ? (
                      <>
                        <div className='flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide'>
                          <span className='relative w-2 h-2 rounded-full bg-emerald-400'>
                            <span className='absolute inset-0 rounded-full bg-emerald-400 animate-ping'></span>
                          </span>
                          <span style={{ color: 'green' }}>Online</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide'>
                          <span className='relative w-2 h-2 rounded-full bg-red-500'>
                            <span className='absolute inset-0 rounded-full bg-red-500 opacity-50'></span>
                          </span>
                          <span style={{ color: 'red' }}>Offline</span>
                        </div>
                      </>
                    )}
                  </span>

                  <div className='flex mt-4 space-x-3 md:mt-6'>
                    <Link href={`/chats-user/${user.id}`}>
                      <Button>Message</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
