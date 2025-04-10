import axios from '@/api/axios'
import ChatByMe from '@/components/ChatByMe'
import ChatByOther from '@/components/ChatByOther'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { IoLogoWhatsapp } from 'react-icons/io'
import { MdArrowBackIosNew } from 'react-icons/md'
import { io } from 'socket.io-client'
import { IoSend } from 'react-icons/io5'
import { SyncLoader } from 'react-spinners'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createLazyFileRoute('/_layout/chats-user/$id')({
  component: ChatUser,
})

interface User {
  id: string
  name: string
  email: string
}

interface Chats {
  id: string
  msg: string
  timeStamp: string
  sender_id: string
  receiver_id: string
}

function ChatUser() {
  const { id } = Route.useParams()

  const [user, setUser] = useState<User>()
  const [r_user, setR_user] = useState<User>()

  const socket = useMemo(
    () => io('http://localhost:8081', { withCredentials: true }),
    []
  )

  // const socket = useMemo(
  //   () => io('http://192.168.1.5:8081', { withCredentials: true }),
  //   []
  // )

  // const [user, setUser] = useState<string>('')
  const [chat, setChat] = useState<string>('')
  const [chats, setChats] = useState<Chats[]>([])
  const [typing, setTyping] = useState<boolean>(false)

  const chatBoxRef = useRef<HTMLDivElement>(null)
  const prevChatCountRef = useRef(0)


  const onClickBack = () => {
    setChat('')
  }

  useEffect(() => {
    const fetchuser = async () => {
      const res = await axios.get(`api/user`)
      setUser(res.data.user)
    }

    const fetchreceiver = async () => {
      const res = await axios.get(`api/user/${id}`)
      setR_user(res.data)
    }

    fetchuser()
    fetchreceiver()
  }, [])

  useEffect(() => {
    socket.emit('typing', { id: user?.id, Rid: id, isTyping: chat ? true : false })
  }, [chat])

  useEffect(() => {
    // Only scroll if the number of chats has increased
    if (chats.length > prevChatCountRef.current) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }

    if (typing && chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView({ behavior: 'smooth' })
    }
   
    prevChatCountRef.current = chats.length
  }, [chats, typing])

  useEffect(() => {
    socket.on('connect', () => {
    })

    socket.on('get-chat', (d: Chats[]) => {
      setChats(d)
    })

    socket.on('show-typing', (data) => {
      const { typingId, typingRid ,isTyping } = data

      if (Number(id) === Number(typingId) && Number(typingRid) === Number(user?.id)) {
        setTyping(isTyping ? true : false)
      }
    })

    socket.emit('receiver-id', id)

    return () => {
      socket.off('connect')
      socket.off('get-chat')
      socket.off('show-typing')
    }
  })

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      socket.emit('add-chat', {
        msg: chat,
        timeStamp: new Date().toLocaleString(),
        sender_id: user?.id,
        receiver_id: id,
      })
      setChat('')
    } catch (error) {
      console.log(error)
    }
  }

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
      <section className='min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-screen-lg bg-white h-[90vh] mx-auto rounded-lg border-2 shadow-xl p-4 sm:p-6'>
          {/* Header */}
          <div className='mb-4 py-2 px-4'>
            <h1 className='flex items-center gap-x-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-zinc-700'>
              <Link href='/chats' onClick={onClickBack}>
                <MdArrowBackIosNew className='text-lg sm:text-xl' />
              </Link>
              <IoLogoWhatsapp className='text-blue-500 text-3xl sm:text-4xl' />
              <span className='truncate'>{r_user?.name}</span>
            </h1>
          </div>

          {/* Chat Area */}
          <div className='h-[65vh] xl:h-[70vh] overflow-y-auto px-4 sm:px-8 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300'>
            {chats &&
              chats.length > 0 &&
              chats.map((cur, i) => {
                return cur.receiver_id === id && cur.sender_id === user?.id ? (
                  <ChatByMe key={i} msg={cur.msg} timestamp={cur.timeStamp} initial={getIntialLetters(user?.name)}/>
                ) : (
                  <ChatByOther
                    key={i}
                    msg={cur.msg}
                    timestamp={cur.timeStamp}
                    initial={getIntialLetters(r_user?.name ?? '')}
                  />
                )
              })}

            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className='chat chat-start'
                >
                  <div className='chat-image avatar'>
                    <div className='w-10 rounded-full'>
                      {/* <img
                        alt='Tailwind CSS chat bubble component'
                        src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                      /> */}
                      <div className="h-full w-full rounded-full flex justify-center items-center bg-slate-200">
                        <span className="text-sm font-mono font-semibold">{getIntialLetters(r_user?.name ?? '')}</span>
                      </div>
                    </div>
                  </div>
                  <div className='chat-header'></div>
                  <div className='chat-bubble chat-bubble-accent'>
                    <SyncLoader size={5} speedMultiplier={0.7} color='gray' />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatBoxRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={onSubmitHandler}
            className='flex items-center gap-x-2 p-2 sm:gap-x-3'
          >
            <input
              placeholder='Enter your message here'
              onChange={(e) => setChat(e.target.value)}
              value={chat}
              type='text'
              className='flex-grow py-2 px-4 rounded-full border-2 border-zinc-300 focus:outline-none focus:border-blue-500 sm:py-3'
            />
            <button
              disabled={!chat}
              type='submit'
              className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-blue-500 text-white ${
                chat ? 'hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <IoSend />
            </button>
          </form>
        </div>
      </section>

      <br />
    </>
  )
}
