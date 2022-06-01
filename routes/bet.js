const express = require('express')
const betRoute = express.Router()
const authRoute = require("../middlewares/auth")

const betController = require("../controller/betController")
const roomAdmin = require("../middlewares/roomAdmin");

// CREATE
betRoute.post("/bet",authRoute,roomAdmin, betController.addBet)


betRoute.get("/bet/:id", betController.getBet)

betRoute.get("/bet" , betController.getBet)

betRoute.patch("/bet/result",authRoute,roomAdmin, betController.addResult)

//// TODO :
// betRoute.put("/bet/:id", betController.updateBet)
//
// // DELETE
// betRoute.delete("/bet", betController.deleteBet)

module.exports = betRoute
