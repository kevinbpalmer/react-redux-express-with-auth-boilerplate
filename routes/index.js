const express = require('express')
const router = express.Router()
const users = require('./users')
const login = require('./login')
const authenticate = require('./authenticate')
const logout = require('./logout')
const verify = require('./verify')
const verifyEmail = require('./verify-email')
const verifyPhone = require('./verify-phone')
const auth = require('./auth')
const resetPassword = require('./reset-password')

// user auth and signup
router.use('/api/v1/users', users)
router.use('/api/v1/login', login)
router.use('/api/v1/authenticate', authenticate)
router.use('/api/v1/verify', verify)
router.use('/api/v1/verify-email', verifyEmail)
router.use('/api/v1/verify-phone', verifyPhone)
router.use('/api/v1/logout', logout)
router.use('/auth', auth)
router.use('/api/v1/reset-password', resetPassword)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'Connected to the api!'
  })
});

module.exports = router;
