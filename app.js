'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
app.use(session({ secret: 'js123456' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(express.static('static'));


// custom modules
var signup = require('./signup.js');

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/hotels', (req, res) => {
  // Get all of hotel information
  res.json(hotels)
})

app.post('/login', (req, res) => {
  // Get all of hotel information
  signup.login(req, res);
})

app.post('/hotel/:hotelId', (req, res) => {
  // Reserve a hotel at the given index

  let ix = getHotelIndex(req.params.hotelId)
  hotels[ix].availability = hotels[ix].availability - 1

  res.status(201).json(hotels)
})

const getHotel = (hotelId) => hotels.find(h => h.id === parseInt(hotelId))
const getHotelIndex = (hotelId) => hotels.findIndex(h => h.id === parseInt(hotelId))

// Mock data for example. Must use real database for production
const hotels = [{
  id: 1,
  name: 'Mars Motel',
  availability: 10
}, {
  id: 2,
  name: 'Space Time International',
  availability: 10
}]

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)

// Export your express server so you can import it in the lambda function.
module.exports = app
