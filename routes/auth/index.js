const express = require('express')
const router = express.Router()
const passport = require('passport')
// api/v1/auth import model
const User = require('../../models/users.model')

router.get('/facebook', passport.authenticate('facebook', {
  failureRedirect: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/login' : '/login'
}), function (req, res, next) {

  res.json({error: false, success: true})
})

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/profile' : '/profile',
  failureRedirect: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/login' : '/login'
}))

module.exports = router
