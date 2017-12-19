const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  req.logout()
  res.json({message: 'Logged out successfully'})
})

module.exports = router
