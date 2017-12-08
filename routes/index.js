var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html').status(200).end();
});

router.get('/search/:movieName', (req, res, next) => {
  var search = req.params.movieName;

  res.send("\n In future versions this should return json objects of movies which match what the user has searched" +
    "\n Currently searched: " + search).status(200).end();
});

module.exports = router;
