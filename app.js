require('dotenv').config()
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const winstonLogger = require('./logging/winston')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const passport = require('passport')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)

// import all strategies for passport
const allStrategies = require('./passport/strategies.js')

// import the mongoose module
const mongoose = require('mongoose')

// import routes
const indexRoute = require('./routes/index')

//Set up default mongoose connection
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true})
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise
//Get the default connection
const db = mongoose.connection

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('We are connected to the database!')
})

// this enables debugging from mongoose for the database
mongoose.set('debug', true);

const app = express()
console.log('NODE_ENV: ', app.get('env'))

// // view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

// uncomment after placing your favicon in /public app.use(favicon(path.join(__dirname, 'public',
// 'favicon.ico')))
app.use(logger('dev'))
app.use(flash())
// if NODE_ENV is 'production' then winstonLogger will exist and we'll get logs written to /logging folder
if (winstonLogger && app.get('env') === 'production') {
  app.use(winstonLogger)
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// publicly available folder
app.use(express.static(path.join(__dirname, 'public')))

// handle sessions for auth purposes
const sessionOpts = {
  secret: 'baby-buggy-bumpers',
  saveUninitialized: true,
  resave: true
}

switch (app.get('env')) {
  case 'production':
    app.use(session((Object.assign({}, sessionOpts, {
      store: new MongoStore({mongooseConnection: db})
    }))))
  case 'staging':
  case 'test':
  case 'development':
  default:
    app.use(session(sessionOpts))
}

// passport initilization
app.use(passport.initialize())
app.use(passport.session())

// import passport strategies
allStrategies(passport)

// register all routes for the application
app.use('/', indexRoute)

// HANDLE ERRORS
app.get('*', function(req, res, next) {
  var err = new Error()
  err.status = 404
  next(err)
});

// Handle anything that is a 404
app.use(function(err, req, res, next) {
  console.log('HANDLING MUH 404 ERROR: ', err.status)
  if(err.status !== 404) {

    return next(err)
  }

  res.status(404)
  res.json({message: err.message || 'Resource not found'})
})

// Unhandled errors go here
app.use(function(err, req, res, next) {
  console.log('FINAL ERROR HANDLER: ', err.message);

  res.status(err.status || 500)
  res.json({
    error: true,
    message: err.message || 'Something went wrong'
  })
})

module.exports = app
