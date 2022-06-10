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
        const diff = bet.deadline - Date.now()
        if (diff < 0 || bet.status === 'closed') {
          if (bet.status === 'open') {
            await Bet.updateOne({ _id: { $in: req.body.bet_id }, status: 'open' }, { status: 'outdated' })
          }
          return res.status(422).json({ error: 'Bet ' + bet.status + ' !' })
        }
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
