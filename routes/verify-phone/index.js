const express = require('express')
const router = express.Router()

// /api/v1/verify-phone
// import model
const User = require('../../models/users.model')
const phoneTokenGen = require('generate-sms-verification-code')
const sendSmsVerification = require('../../utils/sendSmsVerification')

router.post('/', function (req, res, next) {
  console.log('Phonetoken from client: ', req.body.phoneToken);

  if (!req.body.phoneToken) {
    console.error('No phoneToken present')
    const errObject = new Error('No phoneToken present')
    errObject.status = 400
    return next(errObject)
  }

  const phoneToken = req.body.phoneToken
  User.findOne({phoneToken: phoneToken},
    function(err, user){
    if(err){
        console.error('Invalid token')
        const errObject = new Error('Invalid token')
        errObject.status = 400
        return next(errObject)
    }
    else {
      console.log('Is this the world of a true user?? NANI!? ', user)
      if (!user) {
        console.error('Invalid token')
        const errObject = new Error('Invalid token')
        errObject.status = 400
        return next(errObject)
      }
      const convertedExpiry = parseFloat(new Date(user.phoneTokenExpiry).getTime() / 1000)
      const currentDateConverted = parseFloat(new Date().getTime() / 1000)
      const timeDiff = (currentDateConverted - convertedExpiry)/300
      console.log('CONVERTED EXPIRY: ', convertedExpiry)
      console.log('CONVERTED DATE NOW: ', currentDateConverted);
      console.log('TIME DIFF: ', timeDiff);

      if (timeDiff > 10.0) {
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
        user.isVerified = true
        user.save(function (err) {
          if (err) {
            console.error('Failed to verify the token', err)
            const errObject = new Error('Failed to verify the token')
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
  if (!req.body.phoneNumber) {
    console.error('Please enter a phone number')
    const errObject = new Error('Please enter a phone number')
    errObject.status = 400
    return next(errObject)
  }

  const phoneNumber = req.body.phoneNumber
  console.log('PHONENUMBER: ', phoneNumber);
  User.findOne({phoneNumber: phoneNumber},
    function(err, user){
    if(err){
        console.error('Error: No user found by that phone number')
        return res.json({
          error: false,
          success: true
        })
    }
    else {
      if (!user) {
        console.error('No user found by that phone number')
        return res.json({
          error: false,
          success: true
        })
      }
      const phoneToken = phoneTokenGen(4, {type: 'number'})
      user.phoneToken = phoneToken
      user.phoneTokenExpiry = new Date().getTime()

      user.save(function (err) {
        if (err) {
          console.error('Failed to verify user in DB', err)
          return res.json({
            error: false,
            success: true
          })
        }
        else {
          sendSmsVerification(user.phoneToken, user.phoneNumber)
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
