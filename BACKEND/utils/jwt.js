const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()




const generateToken = (payload) => {
    const secret_key = process.env.SECRET_KEY
    const options = {
        expiresIn: '1h'
    }

    const token = jwt.sign(payload, secret_key, options)
    return token
}


const validateToken = (req, res, next) => {
    // const authHeader = req.headers.authorization
    const token = req.cookies.authToken;
    if (token) {
        // const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {

                res.status(403).json({
                    success: false,
                    message: 'Invalid token',
                  })
            } else {
                req.user = payload
                next()

                res.json({
                    message: "Authenticated",
                    user: {
                        id: req.user.id,
                        name: req.user.name,
                        email: req.user.email
                    }
                });
            }
        })
    } else {
        res.status(401).json({
          success: false,
          message: 'Unauthenticated',
        })
      }
    
}

module.exports = {generateToken, validateToken}