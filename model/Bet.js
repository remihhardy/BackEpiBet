const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')
const { ObjectId } = require('mongodb')

const betSchema = mongoose.Schema({
  title: {
    type: String,
    exist: true,
    minlength: 1
  },
  status: {
    type: String
  },
  options: {
    type: [{ type: String }]
  },

  category: {
    type: String
  },
  pronostics: {
    type: [{ type: ObjectId, ref: 'Pronostic' }]
  },
  result: {
    type: Array
  },
  deadline: {
    type: Number
  },
  score_bet: {
    type: Boolean
  }

})

betSchema.plugin(uniqueValidator)
const Bet = mongoose.model('Bet', betSchema)
module.exports = Bet
