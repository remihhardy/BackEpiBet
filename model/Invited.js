
const mongoose = require('mongoose')

const invitedSchema = mongoose.Schema({
  count: {
    type: Number
  }
})

const Invited = mongoose.model('Invited', invitedSchema)
module.exports = Invited
