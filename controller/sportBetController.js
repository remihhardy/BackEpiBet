const axios = require('axios')

exports.getSportBet = async (req, res) => {
  const filter = req.params.category
  let soccer
  axios
    .get(' https://api.the-odds-api.com/v4/sports/' + filter + '/odds?regions=us&apiKey=' + process.env.ODDS_KEY)
    .then(response => {
      soccer = response.data
      res.status(200).json(soccer)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}
