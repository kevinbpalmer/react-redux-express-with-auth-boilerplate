const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../models/users.model')

function localStrategy(passport) {

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID        : process.env.FACEBOOK_APP_ID,
      clientSecret    : process.env.FACEBOOK_APP_SECRET,
      callbackURL     : process.env.FACEBOOK_CALLBACK_URL,
      scope: ['email'],
      profileFields   : ['id', 'email', 'first_name', 'last_name', 'photos']
  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

      // asynchronous
      process.nextTick(function() {
        console.log('Have the profile: ', profile)
          // find the user in the database based on their facebook id
          User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err) {
                console.error('ERROR here: ', err)
                return done(err)
              }
              // if the user is found, then log them in
              if (user) {
                console.log('User already exists: ', user)

                user.facebook.id    = profile.id // set the users facebook id
                user.facebook.token = token // we will save the token that facebook provides to the user
                user.facebook.photo = profile.photos[0].value
                user.isVerified = true // We are going to assume the user if verifed since they have an authentic facebook account

                user.save({ validateBeforeSave: false }, (err, mergedFacebookUser) => {
                  if (err) {
                    console.error('Failed to add facebook information to user in DB: ', err)
                    const errObject = new Error('Failed to merge Facebook profile with existing account')
                    errObject.status = 400
                    return done(errObject, null)
                  } else {
                    return done(null, mergedFacebookUser)
                  }
                })
                return done(null, user) // user found, return that user
              }
              else {
                  // if there is no user found with that facebook id, create them
                  let newUser = new User({
                    facebook: {}
                  })

                  // set all of the facebook information in our user model
                  newUser.facebook.id    = profile.id // set the users facebook id
                  newUser.facebook.token = token // we will save the token that facebook provides to the user
                  newUser.email = profile.emails[0].value // facebook can return multiple emails so we'll take the first
                  newUser.facebook.photo = profile.photos[0].value
                  newUser.firstName = profile.name.givenName // get firstName
                  newUser.lastName = profile.name.familyName // get lastName
                  newUser.isVerified = true // We are going to assume the user if verifed since they have an authentic facebook account

                  // save this new user to the database
                  newUser.save({ validateBeforeSave: false }, (err, newFacebookUser) => {
                    if (err) {
                      console.error('Failed to save user to DB: ', err)
                      const errObject = new Error('Failed to save user to DB')
                      errObject.status = 400
                      return done(errObject, null)
                    } else {
                      return done(null, newFacebookUser)
                    }
                  })
              }

          })
      })

  }))
}

module.exports = localStrategy
