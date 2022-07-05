const jwt = require('jsonwebtoken')
const auth = (req, res, next) => {
  console.log('check token')
  const verifyToken = (req) => {
    const bearerString = req.headers.authorization
    if (typeof bearerString !== 'undefined') {
      const bearer = bearerString.split(' ')
      req.token = bearer[1]
      return req
    }
  }
  verifyToken(req, res)
  jwt.verify(req.token, process.env.TOKEN_SECRET, (err) => {
    if (err) {
      const message = err.message
      console.log('not recognized')
      return res.status(403).json({ error: message })
    } else {
      console.log('user authenticated')
      req.body.user_id = jwt.verify(req.token, process.env.TOKEN_SECRET).user_id
      next()
    }
  })
}

module.exports = auth
