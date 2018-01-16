const router = require('express').Router();

// redirects user to main page if not logged in
function redirectUnauthorized(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    res.redirect('/');
  }
}

router.get('/watching', redirectUnauthorized);

router.get('/watched', redirectUnauthorized);

module.exports = router;