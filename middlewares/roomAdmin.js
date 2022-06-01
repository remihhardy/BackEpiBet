let jwt = require("jsonwebtoken");
const Room = require("../model/Room");
let roomAdmin = async (req, res, next ) => {
    console.log("check if admin of the room")
    let filter = {"_id":req.body.room_id, "admin":req.body.user_id}
    let room= await Room.find(filter)
        .then(()=> {
            console.log("welcome, admin")
            next()
        })
        .catch((err)=>res.status(400).json({"error": err.message}))

};

module.exports = roomAdmin
