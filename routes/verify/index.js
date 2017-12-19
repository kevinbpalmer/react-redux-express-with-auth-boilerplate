const express = require('express')
const router = express.Router()
const passport = require('passport')

// import model
const User = require('../../models/users.model')

const isAuthenticated = function(req, res, next) {
  if (req.user) {
    return next()
  } else {
    return res.status(401).json({error: 'User not authenticated in /api/v1/verify'})
  }
}

const getUserVerificationStatus = function(req, res, next) {

  User.findOne({
    'email': req.user.email
  }, 'isVerified', function(err, person) {
    if (err) {
      return res.status(404).json({message: `User not found using email ${req.user.email}`})
    } else {
      if (person.isVerified === true) {
        console.log('User is verified');
        req.isVerified = true
        return next()
      } else {
        console.error('User is not verified')
        const errObject = new Error('User is not verified')
        errObject.status = 400
        return next(errObject)
      }
    }
  })
}

router.get('/', isAuthenticated, getUserVerificationStatus, function(req, res, next) {
  req.user.password = undefined

  if (req.isVerified === true) {
    return res.json(true)
  } else {
    return res.json(false)
  }
})

module.exports = router
