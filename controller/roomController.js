const Room = require('../model/Room')
const Epicoin = require('../model/Epicoin')
const Bet = require('../model/Bet')

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
  const bets = await Bet.find({ room: req.params.id })
  const betsToUpdate = []
  await bets.map(bet => {
    const diff = bet.deadline - Date.now()
    if (diff < 0) {
      betsToUpdate.push(bet._id)
    }
  })
  await Bet.updateMany({ _id: { $in: betsToUpdate }, status: 'open' }, { status: 'outdated' })

  let filter = {}
  if (req.params.id) {
    filter = { _id: req.params.id }
  }
  const rooms = await Room.find(filter)
    .populate({ path: 'bets', populate: { path: 'pronostics' } })
    .populate('invited', { _id: 1, nickname: 1, image: 1 })
    .populate('participants', { _id: 1, nickname: 1, image: 1 })
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  if (rooms) {
    if (req.params.id) {
      filter = { room: req.params.id }
    } else {
      filter = {}
    }
    const epicoins = await Epicoin.find(filter)
      .populate('user', { _id: 1, nickname: 1, epicount: 1 })
      .catch((e) => {
        res.status(400).json({ error: e.message })
      })
    res.status(200).json({ rooms, epicoins })
  }
}

// UPDATE ROOM
exports.updateRoom = async (req, res) => {
  const filter = { _id: req.body.room_id }

  const newData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    private: req.body.private,
    admin: req.body.admin
  }

  Room.findOneAndUpdate(filter, newData)
    .then((response) => res.status(201).json({
      message: 'room ' + req.body.name + ' updated',
      room_id: response._id
    }))
    .catch((error) => res.status(500).json({ error: error.message }))
}

exports.acceptInvite = async (req, res) => {
  if (!(req.params.room_id && req.body.user_id)) {
    res.status(422).send({ error: 'All inputs are required' })
  } else {
    const filter = { _id: req.params.room_id, invited: req.body.user_id }
    Room.findOneAndUpdate(filter, { $push: { member: req.body.user._id }, $pull: { invited: req.body.user_id } })
      .then(() => res.status(203).json({ success: 'challenge accepted!' }))
      .catch((error) => res.status(400).json({ error: error.message }))
  }
}
exports.declineInvite = async (req, res) => {
  if (!(req.params.room_id && req.body.user_id)) {
    res.status(422).send({ error: 'All inputs are required' })
  } else {
    const filter = { _id: req.params.room_id, invited: req.body.user_id }
    Room.findOneAndUpdate(filter, { $pull: { invited: req.body.user_id } })
      .then(() => res.status(203).json({ success: 'challenge declined!' }))
      .catch((error) => res.status(400).json({ error: error.message }))
  }
}

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
