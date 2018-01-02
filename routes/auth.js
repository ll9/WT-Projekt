const router = require('express').Router();
const passport = require('passport');
const path = require('path');

var changedAuth = false;

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    changedAuth = true;
    res.redirect('/');
})

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    changedAuth = true;
    res.redirect('/');
});

router.get('/sessionStatus', (req, res) => {
	var tmp = changedAuth;
	changedAuth = false;
    res.json({
        isLoggedIn: req.user,
        changedAuth: tmp
    });
    res.status(200).end();
})

module.exports = router;