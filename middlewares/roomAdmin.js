const Room = require('../model/Room')
const roomAdmin = async (req, res, next) => {
  console.log('check if admin of the room')
  const filter = { _id: req.body.room_id, admin: req.body.user_id }
  await Room.find(filter)
    .then(() => {
      console.log('welcome, admin')
      next()
    })
    .catch((err) => res.status(400).json({ error: err.message }))
}

module.exports = roomAdmin
