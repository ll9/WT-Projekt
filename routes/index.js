var express = require('express');
var router = express.Router();
var path = require('path');

const usercollectionName = 'users';
const moviecollectionName = 'movies';

//GET home page. 
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../public/index.html'));
});

router.get('/watching', function(req, res, next) {
  // check if logged in
  if (req.user)
    res.sendFile(path.join(__dirname,'../public/watching.html'));
  else
    res.redirect('/');
});

router.get('/watched', function(req, res, next) {
  if (req.user)
    res.sendFile(path.join(__dirname,'../public/watched.html'));
  else
    res.redirect('/');
});


router.get('/user', (req, res) => {
  var movieCollection = req.db.get(moviecollectionName);
  var userCollection = req.db.get(usercollectionName);

  userCollection.findOne({_id: req.user}).then(user => {
    // create array which contains only the ids (without rating)
    var movielist = user.watching.map(watching => watching.movie_id);
    movieCollection.find( { id: { $in: movielist }}).then(movies => {
      res.json(movies).status(200).end();
    })
  })
})

//Add to Watchlist
router.post('/watchlist/add', (req, res) => {
    if (req.user) {
        var userCollection = req.db.get(usercollectionName);
        userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is not already in watchlist
            if (!(user.watching.map(watching => watching.movie_id).includes(req.body.movie_id))) {
                userCollection.update({
                    _id: req.user
                }, {
                    $push: {
                        watching: {
                            movie_id: req.body.movie_id,
                            rating: null
                        }
                    }
                })
            }
        })
        res.end();
    }
})

router.post('/watchedlist/add', (req, res) => {
    if (req.user) {
        var userCollection = req.db.get(usercollectionName);
        userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is not already in watchlist
            if (!(user.watched.map(watched => watched.movie_id).includes(req.body.movie_id))) {
                userCollection.update({
                    _id: req.user
                }, {
                    $push: {
                        watched: {
                            movie_id: req.body.movie_id,
                            rating: null
                        }
                    }
                })
            }
        })
        res.end();
    }
})


router.get('/search/movies/:movieName', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get(moviecollectionName); 
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
    skip: req.get('page') * 20,
    limit: 20
  };

  movieCollection.find( query, options, function (error, rows) {
    res.json(rows).status(200).end();
  });
});

router.get('/search/popular', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get(moviecollectionName); 

  var query = {
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
    sort: {'popularity': -1},
    skip: req.get('page') * 20,
    limit: 20
  };

  movieCollection.find( query, options, function (error, rows) {
    res.json(rows).status(200).end();
  });
});

module.exports = router;
