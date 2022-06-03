const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library')
const cloudinary = require('cloudinary')
const Epicoin = require('../model/Epicoin')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)

exports.register = async (req, res) => {
  if (!(req.body.email && req.body.nickname && req.body.password && req.body.passwordConfirmation)) {
    res.status(422).send({ error: 'All inputs are required' })
  } else if (req.body.password !== req.body.passwordConfirmation) {
    res.status(422).send({ error: "Password and its confirmation doesn't match" })
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword
    })
    const accessToken = jwt.sign({ user_id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '10h' })
    user.save()
      .then(() => res.status(201).json({ user_id: user._id, token: accessToken }))
      .catch(error => res.status(400).json({ error: error.message }))
  }
}
exports.login = async (req, res) => {
  console.log('login ..')
  if (!(req.body.identity && req.body.password)) {
    return res.status(422).send({ error: 'All inputs are required' })
  }
  let user = await User.findOne({ email: req.body.identity })
  if (!user) {
    user = await User.findOne({ nickname: req.body.identity })
  }
  try {
    const match = await bcrypt.compare(req.body.password, user.password)
    if (match) {
      const accessToken = jwt.sign({ user_id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '10h' })
      res.json({
        accessToken
      })
    } else {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
  } catch (e) {
    console.log(e)
    return res.status(401).json({ message: 'Invalid Credentials' })
  }
}

exports.google = async (req, res) => {
  if (!req.body.code) {
    res.status(422).json({ error: 'no google token found' })
  }

  const token = await req.body.code
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  })
    .catch(error => res.status(400).json({ error: error.message }))
  // eslint-disable-next-line camelcase
  const { email, given_name, picture } = await ticket.getPayload()
  let user = await User.findOne({ email })
  let code = 200
  if (!user) {
    user = new User({
      email,
      // eslint-disable-next-line camelcase
      nickname: given_name
    })
    let image
    await cloudinary.v2.uploader.upload(picture,
      { public_id: user._id },
      function (result) { image = result.url })
    user.image = image
    user.save()
      .catch(error => res.status(400).json({ error: error.message }))
    code = 201
  }
  const accessToken = jwt.sign({ user_id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '10h' })
  res.status(code).json(
    {
      googletoken: token,
      accessToken
    })
}

exports.getUser = async (req, res) => {
  let filter = {}
  if (req.params.id) {
    filter = { _id: req.params.id }
  }
  const user = await User.find(filter, { password: 0 })
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  if (req.params.id) {
    filter = { user: req.params.id }
  } else { filter = {} }
  const epicoins = await Epicoin.find(filter)
    .catch((e) => {
      res.status(400).json({ error: e.message })
    })
  res.status(200).json(user)
}


exports.updateUser = async (req, res) => {
  const filter = { _id: req.body.user_id }
  const user = await User.find(filter)
  const newData = {}

  if (typeof req.body.nickname === 'undefined' || req.body.nickname == '') {
    newData.nickname = user[0].nickname
  } else { newData.nickname = req.body.nickname }

  if (typeof req.body.email === 'undefined' || req.body.email == '') {
    newData.email = user[0].email
  } else { newData.email = req.body.email }

  if (typeof req.body.image === 'undefined' || req.body.image == '') {
    newData.image = user[0].image
  } else { newData.image = req.body.image }

  if (typeof req.body.password !== 'undefined') {
    newData.password = await bcrypt.hash(req.body.password, 10).catch((err) => { console.error(err) })
  }

  User.findOneAndUpdate(filter, newData)
    .then(() => res.status(201).json({ message: 'user ' + req.body.nickname + ' updated' }))
    .catch((error) => res.status(500).json({ error: error.message }))
}

exports.deleteUser = async (req, res) => {
  const filter = { _id: req.body.user_id }
  User.deleteOne(filter)
    .then(
      () => res.status(200).json({ result: 'user deleted' })
    )
    .catch(
      (error) => res.status(400).json({ error: error.message })
    )
}
