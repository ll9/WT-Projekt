const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
	done(null, user.id);
})

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user.id);
	});
})

passport.use(
    new GoogleStrategy({
        // options for the google strat
        callbackURL: '/auth/google/redirect',
        clientID: process.env._clientID,
        clientSecret: process.env._clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists

        User.findOne({
            user_id: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                // already have the user
                console.log("User is: " + currentUser);
                done(null, currentUser);
            } else {
                // create user in the db
                new User({
                    user_id: profile.id,
                }).save().then((newUser) => {
                    console.log('new User created: ' + newUser);
                    done(null, newUser);
                })
            }
        })
    })
)