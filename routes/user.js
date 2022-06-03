const express = require('express')
const userRoute = express.Router()
const userController = require('../controller/userController')
const authRoute = require('../middlewares/auth')

// CREATE
userRoute.post('/user', userController.register)

// LOGIN
userRoute.post('/user/login', userController.login)

// GOOGLE
userRoute.post('/user/google', userController.google)

// READ
userRoute.get('/user/:id', authRoute, userController.getUser)

// UPDATE
userRoute.patch('/user/', authRoute, userController.updateUser)

// DELETE
userRoute.delete('/user/:id', authRoute, userController.deleteUser)

module.exports = userRoute
