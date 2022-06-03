const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')
const { ObjectId } = require('mongodb')

const sportBetSchema = mongoose.Schema({

  options: {
    type: [{ type: String }]
  },
  category: {
    type: ObjectId, ref: 'Category'
  },
  deadline: {
    type: Number
  },
  score_bet: {
    type: Boolean
  }

})

sportBetSchema.plugin(uniqueValidator)
const SportBet = mongoose.model('SportBet', sportBetSchema)
module.exports = SportBet
