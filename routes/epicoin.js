const express = require('express')
const epicoinRoute = express.Router()
const authRoute = require('../middlewares/auth')

const epicoinController = require('../controller/epicoinController')

epicoinRoute.get('/epicoin', authRoute, epicoinController.getEpicoin)

module.exports = epicoinRoute
