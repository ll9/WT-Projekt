var express = require('express');
var router = express.Router();
var path = require('path');


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
  var movieCollection = req.db.get('movies');
  var userCollection = req.db.get('user');

  userCollection.findOne({_id: req.user}).then(user => {
    console.log(user);
    movieCollection.find( { id: { $in: user.watching}}).then(movies => {
      res.json(movies).status(200).end();
    })
  })
})

//Add to Watchlist
router.post('/watchlist/add', (req, res) => {
    if (req.user) {
        var userCollection = req.db.get('user');
        userCollection.update({
            _id: req.user
        }, {
            $addToSet: {
                watching: req.body.movie_id
            }
        })
        res.end();
    }
})


router.get('/search/movies/:movieName', (req, res, next) => {
  // get mongodb collection from app.js, Collection is called tmdb in mongo database
  var movieCollection = req.db.get('movies'); 
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
  var movieCollection = req.db.get('movies'); 

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
