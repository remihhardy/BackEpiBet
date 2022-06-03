const axios = require('axios')

exports.getSportBet = async (req, res) => {
  const filter = req.params.category
  let sport
  axios
    .get(' https://api.the-odds-api.com/v4/sports/' + filter + '/odds?regions=us&apiKey=' + process.env.ODDS_KEY)
    .then(response => {
      sport = response.data
      res.status(200).json(sport)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message })
    })
}
