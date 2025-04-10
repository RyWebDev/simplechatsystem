const DB = require('../../../config/database')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const salt = bcrypt.genSaltSync(1)
const {v4: uuidv4} = require('uuid')
const {generateToken} = require('../../../utils/jwt')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


dotenv.config()


const method = {}

const now = new Date()

method.try = (req, res) => {

    res.json({
        msg: 'This is Try route2222'
    })
}

method.fetchUser = (req, res) => {


}

method.fetchUserId = async(req, res) => {
    
    const {id} = req.params

    const user = await prisma.user.findFirst({
        where: {
            id: +id
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    })

    res.json(user)

}

method.fetchUsers = async (req, res) => {

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true
        }
    })
    res.json(users)

}

method.dashboard = (req, res) => {

    res.json({
        message: 'This is protected route'
    })
}

method.logout = (req, res) => {

    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

    res.json({
        message: 'Logout Successfully!'
    })
}

method.login = async (req, res) => {

    const {email, password} = req.body

    

    try {
        // 1. Find the user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });
    
        // 2. If user does not exist, return error
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
    
        // 3. Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        // 4. Generate JWT token
        // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
        // // 5. Return token to client
        // res.json({ token });

        res.cookie('authToken', generateToken(user), {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client
            secure: false, // Set to true in production to send over HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'Lax', // Prevents CSRF attacks
          });

          
        return res.status(200).json({ message: 'Success!', token: generateToken(user) });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
      }
   
}

method.createUser = async (req, res) => {

        const {email, password, username, contact_no, status} = req.body

        const hashPass = bcrypt.hashSync(password, salt)

        const query = `INSERT INTO users (user_id, email, password, username, contact_no, status)
                        VALUES (?, ?, ?, ?, ?, ?)`

        const values = [uuidv4(), email, hashPass, username, contact_no, status]

       try {
        await DB.localDB.execute(query,values)

        res.json({
            Message: 'User Created successfully!'
        })
       } catch (error) {
        res.status(500).json({error})
       }

}

method.getAlluser = async (req, res) => {

    const query = `SELECT * FROM users`

    try {
        const [results] = await DB.localDB.execute(query)

        res.json(results)
    } catch (error) {
        res.status(500).json({error})
    }

}

method.getUser = async (req, res) => {

    const {user_id} = req.params

    const query = `SELECT * FROM users WHERE user_id = ?`

    try {
        const [results] = await DB.localDB.execute(query,[user_id])
        
        res.json(results)
    } catch (error) {
        res.status(500).json({error})
    }
  
}

method.updateUser = async (req, res) => {

    const {user_id} = req.params

    const {email, password, username, contact_no, status} = req.body

    const hashPass = bcrypt.hashSync(password, salt)

    const query = `UPDATE users SET email = ?, password = ?, username = ?, contact_no = ?, status = ?, updated_at = ? WHERE user_id = ?`

    const values = [email, hashPass, username, contact_no, status, now, user_id]

    try {
        await DB.localDB.execute(query,values)

        res.json({
            Message: 'User updated successfully!'
        })
    } catch (error) {
        res.status(500).json({error})
    }
}

method.deleteUser = async (req, res) => {

    const {user_id} = req.params

    const query = `DELETE FROM users WHERE user_id = ?`

    try {
        await DB.localDB.execute(query,[user_id])
        
        res.json({
            Message: 'User deleted successfully!'
        })
    } catch (error) {
        res.status(500).json({error})
    }

}

module.exports = method