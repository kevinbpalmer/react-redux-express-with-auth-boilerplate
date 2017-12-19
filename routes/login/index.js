const express = require('express')
const router = express.Router()
const passport = require('passport')

// import model
const User = require('../../models/users.model')

router.post('/', passport.authenticate('local', { failureFlash: true }), function(req, res, next) {
  req.user.password = undefined
  res.json(req.user)
})

module.exports = router
