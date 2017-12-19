const express = require('express')
const router = express.Router()

// import model
const User = require('../../models/users.model')

const isAuthenticated = function(req, res, next){
   if(req.user) {
     return next()
   }
   else {
     return res.status(401).json({
       error: 'User not authenticated in /api/v1/authenticate'
     })
   }
}

router.get('/', isAuthenticated, function (req, res, next) {
  req.user.password = undefined
  res.json(req.user)
})

module.exports = router
