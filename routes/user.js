const express = require('express')
const userRoute = express.Router()
const userController = require("../controller/userController")

// CREATE
userRoute.post("/user", userController.register)

//LOGIN
userRoute.post("/user/login", userController.login)

//GOOGLE
userRoute.post("/user/google", userController.google)

//READ
userRoute.get("/user/:id", userController.getUser)

//UPDATE
userRoute.patch("/user/", userController.updateUser)

//DELETE
//userRoute.delete("/user/:id", userController.deleteUser)

module.exports = userRoute
