const express = require('express')
const userRoute = express.Router()
const userController = require("../controller/userController")


// CREATE
userRoute.post("/user", userController.register)

//LOGIN
userRoute.post("/user/login", userController.login)

//GOOGLE
userRoute.post("/user/google",userController.google)

//TODO
// // READ
// userRoute.get("/user",logRoute , userController.getUser)
//
// userRoute.put("/user" ,logRoute, userController.updateUser)
//
//
// // DELETE
// userRoute.delete("/user",logRoute , userController.deleteUser)

module.exports = userRoute
