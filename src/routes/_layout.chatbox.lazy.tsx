import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect, FormEvent, useRef, useLayoutEffect } from 'react'
import { io } from 'socket.io-client'
import { IoLogoWhatsapp } from 'react-icons/io'
import ChatByOther from '@/components/ChatByOther'
import ChatByMe from '@/components/ChatByMe'

export const Route = createLazyFileRoute('/_layout/chatbox')({
  component: ChatBox,
})

type Chats = {
  msg: string
  timeStamp: string
  user: string
}

function ChatBox() {
  const socket = useMemo(() => io('http://localhost:8081', {withCredentials: true}), [])
  const [user, setUser] = useState<string>('')
  const [chat, setChat] = useState<string>('')
  const [chats, setChats] = useState<Chats[]>([])

  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chats])

  useEffect(() => {
    socket.on('connect', () => {
      // setUser(socket.id as unknown as string)
    })

    socket.on('get-chat', (d) => {
      setChats(d)

  
    })

    socket.on('sender-id', (d) => {
      setUser(d)

  
    })

    return () => {
      socket.off('connect')
      socket.off('get-chat')
      socket.off('sender-id')
    }
  })

  useLayoutEffect(() => {

    
    
  },[])

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    socket.emit('add-chat', {
      msg: chat,
      timeStamp: new Date().toLocaleString(),
      user,
    })
    setChat('')
  }

  return (
    <>
      <section className='min-h-full sm:w-min-h-screen flex items-center justify-center scrollbar-thin'>
        <div className='w-full xl:w-[60%] bg-white/10 h-[70vh] mx-auto rounded-lg border-2 shadow-xl p-2'>
          <div className='mb-3 py-2 px-4'>
            <h1 className='inline-flex items-center gap-x-1 text-3xl font-semibold text-zinc-700'>
              <IoLogoWhatsapp className='text-green-500 text-4xl' />
              <span>WhatsApp</span> ID: {user}
            </h1>
          </div>

          <div className='h-[55vh] overflow-y-auto px-10 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300'>
            {chats &&
              chats.length > 0 &&
              chats.map((cur, i) => {
                return cur.user === user ? (
                  <ChatByMe key={i} msg={cur.msg} timestamp={cur.timeStamp} />
                ) : (
                  <ChatByOther
                    key={i}
                    msg={cur.msg}
                    timestamp={cur.timeStamp}
                  />
                )
              })}

            <div ref={chatBoxRef} className=''/>
          </div>

          <form
            onSubmit={onSubmitHandler}
            action=''
            className='mb-3 chats flex items-center gap-x-1'
          >
            <input
              placeholder='Enter your message here'
              onChange={(e) => setChat(e.target.value)}
              value={chat}
              type='text'
              className='w-full py-3 px-4 rounded-full'
            />
            <button
              disabled={chat ? false : true}
              type='submit'
              className='px-5 py-3 bg-green-500 text-zinc-700 rounded-full'
            >
              Chat
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
