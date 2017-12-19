const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/users.model')

function localStrategy(passport) {

  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, function (req, email, password, done) {
    User.findOne({
      email
    },
    function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (!user.verifyPassword(password, null)) {
        return done(null, false)
      } else {
        user.verifyPassword(password, function (err, isMatch) {
          if (err) {
            return done(err)
          } else if (isMatch === false) {
            console.error('Passwords do not match yo')
            return done(null, false, {message: 'Username or password incorrect.'})
          } else if (isMatch === true) {
            return done(null, user)
          }
        })
      }
    })
  }))
}

module.exports = localStrategy
