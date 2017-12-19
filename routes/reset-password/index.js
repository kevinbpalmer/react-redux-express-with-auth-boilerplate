const express = require('express')
const router = express.Router()

// api/v1/reset-password
// import model
const User = require('../../models/users.model')
const emailTokenGen = require('generate-password').generate({length: 32, numbers: true})
const sendEmailResetNotification = require('../../utils/sendEmailToken')
const hashPassword = require('../../utils/hashPassword')

router.post('/check', function(req, res, next) {
  if (!req.body) {
    console.error('No data passed')
    const errObject = new Error('No data passed')
    errObject.status = 400
    return next(errObject)
  }
  if (!req.body.email) {
    console.error('No email found')
    const errObject = new Error('No email found')
    errObject.status = 400
    return next(errObject)
  } else {
    const email = req.body.email

    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.error('Failed to create a new token 2')
        const errObject = new Error('Failed to create a new token 2')
        errObject.status = 400
        return next(errObject)
      } else if (!user) {
        console.error('Failed to find the user')
        const errObject = new Error('Failed to find the user')
        errObject.status = 400
        return next(errObject)
      } else {
        console.log('WE FOUND THE USER: ', user)
        const emailToken = emailTokenGen
        console.log('EMAILTOKEN::: ', emailToken)

        user.emailToken = emailToken
        user.emailTokenExpiry = new Date().getTime()

        user.save(function(err) {
          if (err) {
            console.error('Failed to create a new token', err)
            const errObject = new Error('Failed to create a new token')
            errObject.status = 400
            return next(errObject)
          } else {
            sendEmailResetNotification(user.email, emailToken, true)
            return res.json({success: true})
          }
        })
      }
    })
  }
})

router.post('/check-token', function(req, res, next) {
  if (!req.body) {
    console.error('No data passed')
    const errObject = new Error('No data passed')
    errObject.status = 400
    return next(errObject)
  }
  if (!req.body.token) {
    console.error('No token found')
    const errObject = new Error('No token found')
    errObject.status = 400
    return next(errObject)
  }
  else {
    User.findOne({
      emailToken: req.body.token
    }, function(err, user) {
      if (err) {
        console.error('Failed to find the user1')
        const errObject = new Error('Failed to find the user1')
        errObject.status = 400
        return next(errObject)
      }
      else if (!user) {
        console.error('Failed to find the user2')
        const errObject = new Error('Failed to find the user2')
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
      else {
        res.json({
          error: false,
          token: true
        })
      }
    })
  }
})

router.put('/reset', function(req, res, next) {
  if (!req.body) {
    console.error('No data available')
    const errObject = new Error('No data available')
    errObject.status = 400
    return next(errObject)
  }
  if (!req.body.password) {
    console.error('No password found')
    const errObject = new Error('Please enter a password')
    errObject.status = 400
    return next(errObject)
  }
  if (!req.body.token) {
    console.error('There was no token. Please click the link in your email.')
    const errObject = new Error('There was no token. Please click the link in your email.')
    errObject.status = 400
    return next(errObject)
  }
  else {
    User.findOne({
      emailToken: req.body.token
    }, function(err, user) {
      if (err) {
        console.error('Please try again')
        const errObject = new Error('Please try again')
        errObject.status = 400
        return next(errObject)
      }
      else if (!user) {
        console.error('Please try again')
        const errObject = new Error('Please try again')
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
        console.error('Password reset token is expired. Please request a new one.')
        const errObject = new Error('Password reset token is expired. Please request a new one.')
        errObject.status = 400
        return next(errObject)
      }
      else {
        hashPassword(req.body.password)
        .then(hashedPassword => {
          user.password = hashedPassword

          user.save(function(err) {
            if (err) {
              console.error('Please try again')
              const errObject = new Error('Please try again')
              errObject.status = 400
              return next(errObject)
            } else {

              return res.json({
                error: false,
                token: true,
                reset: true
              })
            }
          })
        })
        .catch(err => {
          console.error('Please try again')
          const errObject = new Error('Please try again')
          errObject.status = 400
          return next(errObject)
        })
      }

    })
  }
})

module.exports = router
