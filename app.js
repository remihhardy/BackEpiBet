const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}))
const userRoute = require('./routes/user')
const roomRoute = require('./routes/room')
const betRoute = require('./routes/bet')
const sportBetRoute = require('./routes/sportBet')
const pronosticRoute = require('./routes/pronostic')
const cloudinary = require('cloudinary')
app.use('/api', userRoute, roomRoute, betRoute, pronosticRoute, sportBetRoute)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.ENVIRONMENT_DOMAIN)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to DB'))
  .catch(console.error)

app.listen(process.env.PORT || 3001, () => {
  console.log('Server UP')
})
app.use('/', (req, res) => {
  return res.status(200).json({ result: 'server up !' })
})
