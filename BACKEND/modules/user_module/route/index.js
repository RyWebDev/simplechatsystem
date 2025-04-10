const express = require('express')
const route = express.Router()


const controller = require('../controller/userController')
const { validateToken } = require('../../../utils/jwt')

route.get('/try', controller.try)

route.post('/login', controller.login)

route.post('/logout', controller.logout)

route.get('/user', validateToken, controller.fetchUser)

route.get('/user/:id', controller.fetchUserId)

route.get('/users', controller.fetchUsers)

route.get('/dashboard', validateToken, controller.dashboard)

route.post('/create_user', controller.createUser)

route.get('/get_all_users', controller.getAlluser)

route.get('/get_user/:user_id', controller.getUser)

route.put('/update_user/:user_id', controller.updateUser)

route.delete('/delete_user/:user_id', controller.deleteUser)

module.exports = route