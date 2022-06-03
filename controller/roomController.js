const Room = require('../model/Room')
const Epicoin = require('../model/Epicoin')

exports.addRoom = async (req, res) => {
  if (!(req.body.name && req.body.category)) {
    res.status(422).send({ error: 'All inputs are required' })
  } else {
    const room = new Room({
      name: req.body.name,
      description: req.body.description,
      private: req.body.private,
      category: req.body.category,
      admin: req.body.user_id,
      participants: [req.body.user_id]
    })
    room.save()
      .then(() => res.status(201).json({ room_id: room._id }))
      .catch(error => res.status(500).json({ error: error.message }))
  }
}
exports.getRoom = async (req, res) => {
  let filter = {}
  if (req.params.id) {
    filter = { _id: req.params.id }
  }
  const rooms = await Room.find(filter)
    .populate({ path: 'bets', populate: { path: 'pronostics' } })
    .populate('invited')
    .populate('participants')
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  if (req.params.id) {
    filter = { room: req.params.id }
  } else {
    filter = {}
  }
  const epicoins = await Epicoin.find(filter)
    .populate('user', { _id: 1, nickname: 1 })
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  res.status(200).json({ rooms, epicoins })
}

// UPDATE ROOM
exports.updateRoom = async (req, res) => {
  let filter = { _id: req.body._id }
  let room = await Room.find(filter)
  console.log("ROOM", room)

  let newData = {
    "name": room[0].name,
    "description": room[0].description,
    "category": room[0].category,
    "private": room[0].private,
    "admin": room[0].admin,
  };

  console.log("NEW DATA", newData);

  Room.findOneAndUpdate(filter, newData)
    .then(() => res.status(201).json({ "message": "room " + req.body.name + " updated" }))
    .catch((error) => res.status(500).json({ "error": error.message }))
};



// exports.deleteRoom =  async(req , res)=> {
//     if (!(req.params.id)) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//     let filter = {_id : req.params.id }
//     Room.deleteOne(filter)
//         .then(
//             () => res.status(200).json({result: "room deleted"})
//         )
//         .catch(
//             (error) => res.status(400).json({error: error.message})
//         )
//
// };
