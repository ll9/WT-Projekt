const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const history = require('connect-history-api-fallback');

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const redirectRoutes = require('./routes/redirect')

const app = express();


/* Using monk and mongoose for db connection */

const usercollectionName = 'users';
const moviecollectionName = 'movies';
// Get database remotely with environment constiable or locally with local mongodb
const db = require('monk')(process.env._MONGODB_URI); // Get the Database with monk
// Using mongoose for User registration (easier to handle)
const mongoose = require('mongoose');
// connect mongoose to remote database
mongoose.connect(process.env._mongoose_URI, () => {
    console.log('connected to mongodb');
})


// uncomment after placing your favicon in /publi
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

// Make the databse accessible to other files (f.e. api.js)
app.use((req, res, next) => {
    req.db = db;
    req.movieCollection = db.get(moviecollectionName);
    req.userCollection = db.get(usercollectionName);
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


//handle routes
app.use('/', redirectRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// middleware takes care of reloading /watching, /watched etc (vue history mode)
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;