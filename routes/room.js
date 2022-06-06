const express = require('express')
const roomRoute = express.Router()
const authRoute = require('../middlewares/auth')
const roomAdmin = require('../middlewares/roomAdmin')

const roomController = require('../controller/roomController')

// CREATE
roomRoute.post('/room', authRoute, roomController.addRoom)

roomRoute.get('/room/:id', roomController.getRoom)

roomRoute.get('/room', roomController.getRoom)

roomRoute.patch('/room/', authRoute, roomAdmin, roomController.updateRoom)

roomRoute.patch('/room/accept/:room_id', authRoute, roomController.acceptInvite)

roomRoute.patch('/room/decline/:room_id', authRoute, roomController.declineInvite)

// // DELETE
// roomRoute.delete("/room", roomController.deleteRoom)

module.exports = roomRoute
