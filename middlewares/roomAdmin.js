const Room = require('../model/Room')
const roomAdmin = async (req, res, next) => {
  console.log('check if admin of the room; id user: ', req.body.user_id)
  console.log('check if admin of the room; id room: ', req.body.room_id)
  const filter = { _id: req.body.room_id, admin: req.body.user_id }
  await Room.findOne(filter)
    .then((response) => {
      if (response) {
        console.log('welcome, admin')
        next()
      } else res.status(403).json({ error: "you're not the room admin" })
    })
    .catch((err) => res.status(400).json({ error: err.message }))
}

module.exports = roomAdmin
