const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const dotenv = require('dotenv')
dotenv.config()

const secret_key = `${process.env.SECRET_KEY}`

module.exports = (io) => {
  const onlineUsers = {}

  io.on('connection', async (socket) => {
    try {
      const cookies = socket.handshake.headers.cookie
      const parsedCookies = cookie.parse(cookies || '')
      const token = parsedCookies.authToken

      if (!token) {
        console.error('No JWT token found in cookies')
        socket.disconnect()
        return
      }

      const decoded = jwt.verify(token, secret_key)
      const user = decoded

      onlineUsers[user.id] = user.name
      io.emit('online-users', onlineUsers)

      socket.on('receiver-id', async (d) => {
        const receiverChat = await prisma.chat.findMany({
          where: {
            OR: [
              { receiver_id: `${d}`, sender_id: +user?.id },
              { sender_id: +d, receiver_id: `${user?.id}` },
            ],
          },
        })

        if (receiverChat) {
          socket.emit('get-chat', receiverChat)
        }
      })

      socket.on('typing', (data) => {
        const { id, Rid ,isTyping } = data
        io.emit('show-typing', { typingId: id, typingRid: Rid, isTyping: isTyping })
      })

      socket.on('add-chat', async (d) => {
        try {
          await prisma.chat.create({
            data: {
              msg: d.msg,
              timeStamp: new Date(d.timeStamp),
              sender_id: d.sender_id,
              receiver_id: d.receiver_id,
            },
          })

          return { success: true }
        } catch (error) {
          console.log(error)
          return { success: false, error }
        }
      })

      socket.on('logout', () => {
        for (const userId in onlineUsers) {
          if (onlineUsers[userId] === user.name) {
            delete onlineUsers[userId]
            break
          }
        }

        io.emit('online-users', onlineUsers)
      })
    } catch (error) {
      console.error('Authentication error:', error)
      socket.disconnect()
    }
  })
}
