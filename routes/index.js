var express = require('express');
var router = express.Router();
var path = require('path');
var GoogleAuth = require('google-auth-library');

var auth = new GoogleAuth;
var client = new auth.OAuth2('521445391748-2usgjdl33k9k8beh2jkga4lglohkgeee.apps.googleusercontent.com', '', '');


//GET home page. 
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../public/index.html'));
});

router.get('/watching', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../public/watching.html'));
});

router.get('/watched', function(req, res, next) {
  res.sendFile(path.join(__dirname,'../public/watched.html'));
});

router.post('/tokensignin', (req, res) => {
    console.log("Start logging body");
    console.log(req.body);
    console.log("Logged body");
    client.verifyIdToken(
        // Token
        req.body.body.split("=")[1],
        // Client ID
        '521445391748-2usgjdl33k9k8beh2jkga4lglohkgeee.apps.googleusercontent.com',
        function(e, login) {
            var payload = login.getPayload();
            var userid = payload['sub'];
            console.log("Userid is: " + userid);

            // Insert User to db if he doesn't exists already
            var userCollection = req.db.get('users');
            userCollection.findOne({
                user_id: userid
            }).then(docs => {
                console.log(docs);
                if (docs == null) {
                    userCollection.insert({
                        user_id: userid,
                        watching: [],
                        watched: []
                    })
                }
            })
            res.end();
        });
})

router.get('/user', (req, res) => {
    console.log(req.get('google_id_token'));

    client.verifyIdToken(
        // Token
        req.get('google_id_token'),
        // Client ID
        '521445391748-2usgjdl33k9k8beh2jkga4lglohkgeee.apps.googleusercontent.com',
        function(e, login) {
            //TODO Error will need to be handled later on when token expires
            var payload = login.getPayload();
            var userid = payload['sub'];
            console.log("Userid is: " + userid);

            // Insert User to db if he doesn't exists already
            var userCollection = req.db.get('users');
            var movieCollection = req.db.get('movies');

            userCollection.findOne({
                user_id: userid
            }).then(docs => {
                console.log(docs.watching);
                movieCollection.find( { id: { $in: docs.watching}})
                  .then(docs => {
                    console.log(docs);
                    res.json(docs).status(200).end();
                  })
                })
            })
})

router.post('/watchlist/add', (req, res) => {
    console.log("Start logging body");
    console.log(req.body);
    console.log("Logged body");
    client.verifyIdToken(
        // Token
        req.body.google_id_token,
        // Client ID
        '521445391748-2usgjdl33k9k8beh2jkga4lglohkgeee.apps.googleusercontent.com',
        function(e, login) {
            var payload = login.getPayload();
            var userid = payload['sub'];
            console.log("Userid is: " + userid);
            console.log("Movie ID is: " + req.body.movie_id);

            var userCollection = req.db.get('users'); 
            userCollection.update({user_id: userid}, { $addToSet: {watching: req.body.movie_id} })

            res.end();
        });
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
