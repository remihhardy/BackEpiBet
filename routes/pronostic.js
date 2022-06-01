const express = require('express')
const pronosticRoute = express.Router()
const authRoute = require("../middlewares/auth")

const pronosticController = require("../controller/pronosticController")
const roomAdmin = require("../middlewares/roomAdmin");

// CREATE
pronosticRoute.post("/pronostic",authRoute, pronosticController.addPronostic)


//// TODO :
// pronosticRoute.put("/pronostic/:id", pronosticController.updatePronostic)
//
// // DELETE
// pronosticRoute.delete("/pronostic", pronosticController.deletePronostic)

module.exports = pronosticRoute
