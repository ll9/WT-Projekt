var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/watching', function(req, res, next) {
  // check if logged in, else redirect
  if (req.user) {
    next();
  }
  else {
    res.redirect('/');
  }
});

router.get('/watched', function(req, res, next) {
  if (req.user)
    next();
  else
    res.redirect('/');
});

module.exports = router;