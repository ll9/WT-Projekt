var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html').status(200).end();
});

router.get('/search/:movieName', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get('tmdb'); 
  var search = "\"" + req.params.movieName + "\""; //search whole phrase

  movieCollection.find({ $text: {$search: search} }, {fields: {}, sort: {'popularity': -1}, limit: 5}, function (error, rows) {
    res.json(rows).status(200).end();
  });
});

module.exports = router;
