var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html').status(200).end();
});

router.get('/search/movies/:movieName', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get('tmdb'); 
  var search = "\"" + req.params.movieName + "\""; //search whole phrase


  var query = {
    $text: {$search: search},
    // if genres in req.query create genre filter, else do nothing
    ...('genres' in req.query) && 
    {
      genres: 
      {
        $all: req.query.genres.split(',').map( genre => ( {$elemMatch: {name: genre}} ) )
      }
    } ,
    // if rating in req.query create rating filter, else do nothing
    ...('rating' in req.query) && 
    { vote_average: { $gt: parseFloat(req.query.rating)} } ,
    // if year in req.query create rating filter, else do nothing
    ...('years' in req.query) && 
    { release_date: { 
        $gt: req.query.years.split(',')[0],
        $lt: (req.query.years.split(',')[1] + '-31-12') 
      } 
    }
  }

  var options = {
    fields: {},
    sort: {'popularity': -1},
    limit: 50
  };

  movieCollection.find( query, options, function (error, rows) {
    res.json(rows).status(200).end();
  });
});

router.get('/search/popular', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get('tmdb'); 

  var query = {

  };

  var options = {
    sort: {'popularity': -1},
    limit: 50
  };

  movieCollection.find( query, options, function (error, rows) {
    res.json(rows).status(200).end();
  });
});

module.exports = router;
