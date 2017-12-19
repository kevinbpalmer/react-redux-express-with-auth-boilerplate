const Local = require('./strategies/local')
const Facebook = require('./strategies/facebook')
const User = require('../models/users.model')

function allStrategies(passport) {

  passport.serializeUser(function (user, done) {
    // console.log('serializeUser', user)
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    User.findById(user._id, function(err, user) {
      // console.log('deserializeUser: ', err, user)
      done(err, user);
    });
  })

  Local(passport)
  Facebook(passport)
}

module.exports = allStrategies
