var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const history = require('connect-history-api-fallback');

var apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const redirectRoutes = require('./routes/redirect')

var app = express();

const url = 'localhost:27017/tmdb'; // Contains default mongo Port (27017) and name of the database (tmpusr)
// Get database remotely with environment variable or locally with local mongodb
const db = require('monk')(process.env._MONGODB_URI || url); // Get the Database with monk
// Monk seems to not have enough advanced functionality => replace if by mongoose later on
const mongoose = require('mongoose');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

// Make the databse accessible to other files (f.e. index.js)
app.use((req, res, next) => {
  req.db = db; 
  next();
});

// Cookie encryption, Lasts a Day
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env._cookieKey]
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect mongoose to remote database
mongoose.connect(process.env._mongoose_URI, () => {
  console.log('connected to mongodb');
})

//handle routes
app.use('/', redirectRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
// middleware takes care of reloading /watching, /watched etc
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;