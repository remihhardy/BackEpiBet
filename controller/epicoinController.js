const Epicoin = require('../model/Epicoin')

exports.getEpicoin = async (req, res) => {
  const filter = { user: req.body.user_id }
  const epicoins = await Epicoin.find(filter)
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  res.status(200).json(epicoins)
}
