const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()

var config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

const localDB = mysql.createPool(config)

localDB.getConnection((err) => {
  if (err) {
    console.log('Database connection is not established')
  } else {
    console.log('Database connected')
  }
})

module.exports = { localDB }
