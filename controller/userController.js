const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library')
const cloudinary = require('cloudinary')
const Epicoin = require('../model/Epicoin')
const Room = require('../model/Room')
const Invited = require('../model/Invited')
const Pronostic = require('../model/Pronostic')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)

exports.register = async (req, res) => {
  if (req.body.invited_id) {
    const user = await User.findOne({ _id: req.body.invited_id, invited: true })
    if (!user) {
      res.status(400).send({ error: 'no users with such id are invited' })
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      let accessToken
      User.findOneAndUpdate({ _id: req.body.invited_id },
        {
          email: req.body.email,
          nickname: req.body.nickname,
          password: hashedPassword,
          invited: false
        }
      )
        .then((response) => {
          accessToken = jwt.sign({ user_id: response._id }, process.env.TOKEN_SECRET, { expiresIn: '10h' })
        }).then(() => res.status(201).json({ user_id: user._id, token: accessToken }))
        .catch(error => res.status(400).json({ error: error.message }))
    }
  } else {
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

    const image = await cloudinary.v2.uploader.upload(picture,
      { public_id: user._id },
      function (result, error) {
        console.log(result, error
        )
      })
    user.image = image.url
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
  if (user) {
    if (req.params.id) {
      filter = { user: req.params.id }
    } else { filter = {} }
    await Epicoin.find(filter)
      .then((response) => {
        user.epicoins = response
      })
      .then(() => Pronostic.find(filter)
        .then((response) => user.pronostics = response))
      .catch((e) => {
        res.status(400).json({ error: e.message })
      })
    res.status(200).json({ user, epicoins: user.epicoins, pronostics: user.pronostics })
  }
}

exports.updateUser = async (req, res) => {
  const filter = { _id: req.body.user_id }
  const user = await User.findOne(filter)
  const newData = {}

  const match = await bcrypt.compare(req.body.password, user.password)
    .catch((error) => console.log(error))
  if (match) {
    if (typeof req.body.nickname === 'undefined' || req.body.nickname === '') {
      newData.nickname = user[0].nickname
    } else { newData.nickname = req.body.nickname }

    if (typeof req.body.email === 'undefined' || req.body.email === '') {
      newData.email = user[0].email
    } else { newData.email = req.body.email }

    if (typeof req.body.image === 'undefined' || req.body.image === '') {
      newData.image = user[0].image
    } else {
      const imageUpload = await cloudinary.v2.uploader.upload(req.body.image,
        { public_id: user._id },
        function (result, error) { console.log(result, error) }
      )
      newData.image = imageUpload.url

      console.log(newData.image)
    }
    if (typeof req.body.newpassword !== 'undefined') {
      newData.password = await bcrypt.hash(req.body.newpassword, 10).catch((err) => { console.error(err) })
    }

    User.findOneAndUpdate(filter, newData)
      .then(() => res.status(201).json({ message: 'user ' + req.body.nickname + ' updated' }))
      .catch((error) => res.status(500).json({ error: error.message }))
  } else {
    res.status(403).json({ error: 'wrong password' })
  }
}

exports.deleteUser = async (req, res) => {
  const filter = { _id: req.body.user_id }
  User.updateOne(filter, { nickname: req.body.user_id, email: req.body.user_id })
    .then(() => Room.updateMany({ admin: req.body.user_id }, { open: false })
    )
    .then(
      () => res.status(200).json({ result: 'personal data are deleted, we keep epicoins data for stats display' })
    )
    .catch(
      (error) => res.status(400).json({ error: error.message })
    )
}

exports.invite = async (req, res) => {
  req.body.mails.forEach((email) => {
    User.findOne({ email })
      .then((user) => Room.findOneAndUpdate({ _id: req.body.room_id }, { $push: { invited: user._id } }))
      .then(() => req.body.number--)
      .catch((error) => console.log(error))
  })
  const invitedId = []
  const invited = new Invited({
    count: 0
  })
  invited.save()
    .catch(error => res.status(400).json({ error: error.message }))
  let invitedCount = invited.count
  while (req.body.number > 0) {
    const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(2), 10)
    const user = new User({
      email: 'NewPlayer' + invited.id + invitedCount,
      nickname: 'NewPlayer' + invited.id + invitedCount,
      password: hashedPassword,
      invited: true
    })
    await user.save()
      // eslint-disable-next-line camelcase
      .then(() => {
        return invitedId.push(user._id)
      })
      .catch(error => res.status(400).json({ error: error.message }))
    await Room.updateOne({ _id: req.body.room_id }, { $push: { invited: user._id } })
      .catch((err) => {
        return res.status(400).json({ error: err.message })
      })
    req.body.number--
    invitedCount++
  }
  await invited.updateOne({ count: invitedCount })
    .then(() => res.status(201).json({ invited: invitedId }))
    .catch((err) => res.status(400).json(err.message))
}
