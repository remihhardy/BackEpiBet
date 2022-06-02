const Pronostic = require('../model/Pronostic')
const Bet = require('../model/Bet')
const Room = require('../model/Room')

exports.addPronostic = async (req, res) => {
  if (!(req.body.pronostic && req.body.bet_id && req.body.user_id)) {
    res.status(422).send({ error: 'All inputs are required' })
  } else {
    const isMember = await Room.findOne({ participants: req.body.user_id, bets: req.body.bet_id })
      .catch((err) => { res.status(500).json({ error: err.message }) })
    const isPrivateRoom = await Room.findOne({ bets: req.body.bet_id })
      .catch((err) => { res.status(500).json({ error: err.message }) })
    if (!isMember && isPrivateRoom.private) {
      res.status(403).json({ error: 'you\'re not a room member' })
    } else if (!isMember) {
      await Room.findOneAndUpdate({ bets: req.body.bet_id }, { $push: { participants: req.body.user_id } })
        .catch((err) => {
          res.status(500).json({ error: err.message })
        })
    } else {
      const alreadyBet = await Pronostic.findOne({ user: req.body.user_id, bet: req.body.bet_id })
      if (!alreadyBet) {
        const bet = await Bet.findOne({ _id: req.body.bet_id })

        if (bet.options.length !== req.body.pronostic.length) {
          return res.status(422).json({ error: 'wrong guess, bad number of options' })
        }
        if (!bet.score_bet) {
          const sum = req.body.pronostic.reduce((partialSum, a) => partialSum + a, 0)
          if (sum !== 1) {
            return res.status(422).json({ error: 'wrong guess, not 1 or 0 value' })
          }
        }

        const pronostic = new Pronostic({
          user: req.body.user_id,
          bet: req.body.bet_id,
          pronostic: req.body.pronostic
        })
        pronostic.save()
          .then(() => Bet.updateOne({ _id: req.body.bet_id }, { $push: { pronostics: pronostic._id } }))
          .then(() => res.status(201).json({ pronostic_id: pronostic._id }))
          .catch(error => res.status(403).json({ error: error.message }))
      } else {
        res.status(403).json({ error: 'pronostic already set' })
      }
    }
  }
}

// TODO : update pronostic
// exports.updatePronostic =  async(req , res)=> {
//     if (!(req.body.title && req.params.id&& req.body.releaseDate&& req.body.genre&& req.body.image && req.body.plot && req.body.director )) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//
//     else {
//         let filter = {_id: req.params.id}
//
//         Pronostic.findOneAndUpdate(filter,
//             {
//                 "title": req.body.title,
//                 "releaseDate": req.body.genre,
//                 "image": req.body.image,
//                 "plot": req.body.plot,
//                 "director": req.body.director,
//             }
//         )
//             .then(() => res.status(201).json({"message": "pronostic " + req.body.title + " updated"}))
//             .catch((error) => res.status(500).json({"error": error.message}))
//     }
// };
// exports.deletePronostic =  async(req , res)=> {
//     if (!(req.params.id)) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//     let filter = {_id : req.params.id }
//     Pronostic.deleteOne(filter)
//         .then(
//             () => res.status(200).json({result: "pronostic deleted"})
//         )
//         .catch(
//             (error) => res.status(400).json({error: error.message})
//         )
//
// };