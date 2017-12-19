const express = require('express')
const router = express.Router()

// api/v1/verify-email
// import model
const User = require('../../models/users.model')
const emailTokenGen = require('generate-password').generate({length: 32, numbers: true})
const sendEmailToken = require('../../utils/sendEmailToken')

router.post('/', function (req, res, next) {

  if (!req.body.emailToken) {
    console.error('No emailToken was passed to /api/v1/verify-email')
    const errObject = new Error('No emailToken was passed to /api/v1/verify-email')
    errObject.status = 400
    return next(errObject)
  }

  const emailToken = req.body.emailToken
  User.findOne({emailToken: emailToken},
    function(err, user){
      console.log('USER?!?', user, emailToken)
    if(err){
        console.error('Unable to find a user with that token')
        const errObject = new Error('Unable to find a user with that token')
        errObject.status = 400
        return next(errObject)
    }
    else {
      if (!user) {
        console.error('Invalid token')
        const errObject = new Error('Invalid token')
        errObject.status = 400
        return next(errObject)
      }
      const convertedExpiry = parseFloat(new Date(user.emailTokenExpiry).getTime() / 1000)
      const currentDateConverted = parseFloat(new Date().getTime() / 1000)
      const timeDiff = (currentDateConverted - convertedExpiry)/3600
      console.log('CONVERTED EXPIRY: ', convertedExpiry)
      console.log('CONVERTED DATE NOW: ', currentDateConverted);
      console.log('TIME DIFF: ', timeDiff);

      if (timeDiff > 3.0) {
        console.error('Token is expired')
        const errObject = new Error('Token is expired')
        errObject.status = 400
        return next(errObject)
      }
      else if (user.isVerified === true) {
        console.error('You are already verified')
        const errObject = new Error('You are already verified')
        errObject.status = 400
        return next(errObject)
      }
      else {
        console.log('token exists with this user: ', user)
        user.isVerified = true
        user.save(function (err) {
          if (err) {
            console.error('Failed to verify user in DB', err)
            const errObject = new Error('Failed to verify user in DB')
            errObject.status = 400
            return next(errObject)
          }
          else {
            return res.json(user)
          }
        })
      }
    }
  })
})

router.post('/reset', function (req, res, next) {
  if (!req.body.emailAddress) {
    console.error('Please enter an email address')
    const errObject = new Error('Please enter an email address')
    errObject.status = 400
    return next(errObject)
  }

  const emailAddress = req.body.emailAddress
  console.log('EMAILADDRESS: ', emailAddress);
  User.findOne({email: emailAddress},
    function(err, user){
    if(err){
        console.error('Error: No user found by that email address')
        return res.json({
          error: false,
          success: true
        })
    }
    else {
      if (!user) {
        console.log('MEH:', user, err);
        console.error('No user found by that email address')
        return res.json({
          error: false,
          success: true
        })
      }
      const emailToken = emailTokenGen
      user.emailToken = emailToken
      user.emailTokenExpiry = new Date().getTime()

      user.save(function (err) {
        if (err) {
          console.error('Failed to verify user in DB', err)
          return res.json({
            error: false,
            success: true
          })
        }
        else {
          sendEmailToken(user.email, user.emailToken)

          return res.json({
            error: false,
            success: true
          })
        }
      })
    }
  })
})

module.exports = router
