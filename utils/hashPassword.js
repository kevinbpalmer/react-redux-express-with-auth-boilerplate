const bcrypt = require('bcrypt')

function hashPassword(password) {
    return new Promise(function(resolve, reject) {
      //hashing a password before saving it to the database
      bcrypt.hash(password, bcrypt.genSaltSync(14), function(err, hash) {
        if (err) {
          return reject(false)
        }
        console.log('Hashed the password: ', password, hash)
        return resolve(hash)
      })
    });
  }


module.exports = hashPassword
