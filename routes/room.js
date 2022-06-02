const express = require('express')
const roomRoute = express.Router()
const authRoute = require('../middlewares/auth')

const roomController = require('../controller/roomController')

// CREATE
roomRoute.post('/room', authRoute, roomController.addRoom)

roomRoute.get('/room/:id', roomController.getRoom)

roomRoute.get('/room', roomController.getRoom)
/// / TODO :
// roomRoute.put("/room/:id", roomController.updateRoom)
//
// // DELETE
// roomRoute.delete("/room", roomController.deleteRoom)

module.exports = roomRoute