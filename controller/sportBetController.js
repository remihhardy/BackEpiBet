const axios = require('axios')

exports.getSportBet = async (req, res) => {
  const filter = req.params.category
  if (req.params.type === 'odds') {
    let sport
    axios
      .get(' https://api.the-odds-api.com/v4/sports/' + filter + '/odds?dateFormat=unix&regions=us&apiKey=' + process.env.ODDS_KEY)
      .then(response => {
        sport = response.data
        res.status(200).json(sport)
      })
      .catch((error) => {
        res.status(400).json({ error: error.message })
      })
  } else if (req.params.type === 'scores') {
    let sport
    axios
      .get(' https://api.the-odds-api.com/v4/sports/' + filter + '/scores/?daysFrom=3&dateFormat=unix&regions=us&apiKey=' + process.env.ODDS_KEY)
      .then(response => {
        sport = response.data
        res.status(200).json(sport)
      })
      .catch((error) => {
        res.status(400).json({ error: error.message })
      })
  }
}
