const express = require('express')
const router = express.Router()

// import model
const User = require('../../models/users.model')

const emailTokenGen = require('generate-password').generate({length: 32, numbers: true})
const phoneTokenGen = require('generate-sms-verification-code')
const hashPassword = require('../../utils/hashPassword')

/* What happens when we make a get request */
router.get('/', (req, res, next) => {
  // the user is not authenticated at all then remove the fields listed below from the result
  if (!req.user) {
    User.find(null,
      {
        'password': 0,
        '__v': 0,
        'updatedAt': 0,
        'createdAt': 0,
        'emailToken': 0,
        'phoneToken': 0,
        'phoneTokenExpiry': 0,
        'emailTokenExpiry': 0
      },
      (err, users) => {
      if (err) {
        console.error(err)
        res.status(404)
        return res.json(err)
      } else {
        return res.json(users)
      }
    })
  }
   else {
     User.find((err, users) => {
       if (err) {
         console.error(err)
         res.status(404)
         return res.json(err)
       } else {

         // If the user is authenticated then do a check to make sure their id is the same as the data they are pulling. Otherwise hide sensitive data.
         users.map((user, index) => {
           if (user._id.toString() !== req.user._id) {
             user.password = undefined
             user.__v = undefined
             user.updatedAt = undefined
             user.createdAt = undefined
             user.phoneTokenExpiry = undefined
             user.emailTokenExpiry = undefined

           }
         })
         return res.json(users)
       }
     })
   }
})

router.post('/', (req, res, next) => {
  console.log('Request data sent to /api/v1/users POST: ', req.body)
  const {firstName, lastName, email, phoneNumber, password, passwordConf, ustaRating} = req.body

  if (!firstName, !lastName, !email, !password, !passwordConf, !phoneNumber, !ustaRating) {
    const errMsg = 'Missing a required field'
    console.error(errMsg)
    res.status(422)
    return res.json(errMsg)
  }
  else if (password !== passwordConf) {
    console.error('Passwords do not match')
    const errObject = new Error('Passwords do not match')
    errObject.status = 400
    return next(errObject)
  }

    hashPassword(password)
    .then(hashedPassword => {
      const emailToken = emailTokenGen
      const phoneToken = phoneTokenGen(4, {type: 'number'})

      const userData = {
        allFields: true,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phoneNumber,
        ustaRating,
        emailToken,
        phoneToken
      }

      User.create(userData, (err, user) => {
        if (err) {
          console.error('Failed to save user to DB: ', err)
          res.status(400)
          return res.json(err.message)
        } else {

          return res.json(user.onCreate(user))
        }
      })
    })
    .catch(failure => {
      console.error('Failed to hash the password')
      const errObject = new Error('Failed to hash the password')
      errObject.status = 400
      return next(errObject)
    })
})

router.put('/', (req, res, next) => {
  // check to make sure there is actually some data from the user
  if (!req.body) {
    console.error('Please fill out all fields')
    const errObject = new Error('Please fill out all fields')
    errObject.status = 400
    next(errObject)
  }
  // check to make sure the user is logged in and authenticated
  if (!req.user) {
    console.error('Please make sure that you are logged in')
    const errObject = new Error('Please make sure that you are logged in')
    errObject.status =
    next(errObject)
  }
  // here we search for the user by their id in the database
  else {
    User.findById(req.user._id, function (err, user) {
    console.log('Got user to update: ', user)

      for (var key in req.body) {
        console.log('KEY: ', key)

        if (req.body.hasOwnProperty(key)) {
          const value = req.body[key]
          console.log('VALUE: ', value)

          user[key] = value
        }
      }

      user.save(function (err, returnedUser) {
        if (err) {
          console.error('Error saving user to DB', err)
          const errObject = new Error('Error saving user to DB')
          errObject.status = 400
          return next(errObject)
        }
        console.log('UPDATED USER: ', returnedUser)
        res.json(returnedUser)
      })
    })
  }

})

module.exports = router
