const express = require('express')
const pronosticRoute = express.Router()
const authRoute = require('../middlewares/auth')

const pronosticController = require('../controller/pronosticController')

// CREATE
pronosticRoute.post('/pronostic', authRoute, pronosticController.addPronostic)

module.exports = pronosticRoute
