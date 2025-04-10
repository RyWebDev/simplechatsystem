const express = require('express')
const route = require('./modules/user_module/route')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require('socket.io')
const { createServer } = require('http')

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001','http://192.168.1.5:3001'],
    credentials: true
  },
})

require('./modules/socket')(io)

const corsOptions = {
  origin: ['http://localhost:3001','http://192.168.1.5:3001'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', route)

server.listen(process.env.APP_PORT, function () {
  console.log(`Listening on port ${process.env.APP_PORT}`)
})
