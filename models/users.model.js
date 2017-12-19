const mongoose = require('mongoose')
const validate = require('mongoose-validator')
const moment = require('moment')
const bcrypt = require('bcrypt')

// Define users schema
const Schema = mongoose.Schema

// custom functions modules
const sendEmailToken = require('../utils/sendEmailToken')
const sendSmsVerification = require('../utils/sendSmsVerification')

// custom function to check if the field is a valid email address
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const validatePhone = [
  validate({
    validator: 'isLength',
    arguments: [
      10, 10
    ],
    message: 'Phone Number should be 10 characters exactly'
  }),
  validate({validator: 'isNumeric', passIfEmpty: false, message: 'Phone should contain numbers only'})
]

const validateName = [
  validate({
    validator: 'isLength',
    arguments: [
      2, 30
    ],
    message: 'Name should be between 2 to 30 characters'
  }),
  validate({validator: 'isAlphanumeric', message: 'Name can only contain numbers or letters'})
]

const UsersSchema = new Schema({
  allFields: {
    type: Boolean,
    default: false
  },
  facebook: {
    type: Object,
    default: {}
  },
  ustaRating: {
    type: Number,
    default: null,
    required: true
  },
  password: {
    type: String
  },
  passwordConf: {
    type: String
  },
  firstName: {
    type: String,
    required: true,
    //validate: validateName
  },
  lastName: {
    type: String,
    required: true,
    // validate: validateName
  },
  email: {
    type: String,
    unique: [
      true, 'Email address already exists'
    ],
    required: [
      true, 'Email address is required'
    ],
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Please use a valid email address']
  },
  phoneNumber: {
    type: String,
    required: [
      true, 'Phone number is required'
    ],
    validate: validatePhone,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailToken: {
    type: String
  },
  emailTokenExpiry: {
    type: Date,
    default: new Date().getTime()
  },
  phoneToken: {
    type: String
  },
  phoneTokenExpiry: {
    type: Date,
    default: new Date().getTime()
  },
  createdAt: {
    type: Date,
    default: moment().format('YYYY-MM-DD')
  },
  updatedAt: {
    type: Date,
    default: moment().format('YYYY-MM-DD')
  }
}, {versionKey: false})

// this is a post hook of the schema. It runs everytime there is a save and it checks to see if the user has all required fields to be considered valid. If it does and the 'allFields' value is still false then set it to true
UsersSchema.post('save', function(user) {
  if (user.allFields === false) {
    if (
      user.email &&
      user.lastName &&
      user.firstName &&
      user.isVerified &&
      user.phoneNumber &&
      user.ustaRating) {
        user.allFields = true
        user.save(function (err, returnedUser) {
          if (err) {
            console.error('Error saving user to DB', err)
            const errObject = new Error('Error saving user to DB')
            errObject.status = 400
          }
          console.log('USER NOW HAS ALL FIELDS ', returnedUser)
      })
    }
  }
})

// .methods() is a method that extends the schema and allows for calls to this method elsewhere This could be super useful in the future.
UsersSchema.methods.onCreate = function (user) {
  sendEmailToken(user.email, user.emailToken)
  sendSmsVerification(user.phoneToken, user.phoneNumber)

  user.password = undefined
  user.__v = undefined
  user.updatedAt = undefined
  user.createdAt = undefined
  user.emailToken = undefined
  user.phoneToken = undefined
  user.phoneTokenExpiry = undefined
  user.emailTokenExpiry = undefined

  return user
}

UsersSchema.methods.verifyPassword = function (password, cb) {
  if (cb === null) {
    return true
  }
  console.log('comparing password', password, this.password);
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('ISMATCH? ', isMatch);
    cb(err, isMatch);
  });
}

// Compile model from schema
const User = mongoose.model('User', UsersSchema)

module.exports = User
