const express = require('express')
const sportBetRoute = express.Router()
const authRoute = require('../middlewares/auth')

const sportBetController = require('../controller/sportBetController')

// GET

sportBetRoute.get('/sportBet/:category/:type', authRoute, sportBetController.getSportBet)

module.exports = sportBetRoute
