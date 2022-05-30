const express = require('express')
const userRoute = express.Router()
const logRoute = require("../middlewares/logRoute")
const userController = require("../controller/userController")

// CREATE
userRoute.post("/user", userController.addUser)
// TODO
// //LOGIN
// userRoute.post("/user/login", userController.login)
//
// // READ
// userRoute.get("/user",logRoute , userController.getUser)
//
// userRoute.put("/user" ,logRoute, userController.updateUser)
//
//
// // DELETE
// userRoute.delete("/user",logRoute , userController.deleteUser)

module.exports = userRoute
