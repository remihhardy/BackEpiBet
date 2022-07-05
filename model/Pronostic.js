const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')
const { ObjectId } = require('mongodb')

const pronosticSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    exist: true
  },
  bet: {
    type: ObjectId,
    ref: 'Bet',
    exist: true
  },
  pronostic: {
    type: Array
  },
  won: {
    type: Boolean
  },
  points_earned: {
    type: Number
  }
})

pronosticSchema.plugin(uniqueValidator)
const Pronostic = mongoose.model('Pronostic', pronosticSchema)
module.exports = Pronostic
