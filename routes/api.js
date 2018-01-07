var express = require('express');
var router = express.Router();
var path = require('path');

const usercollectionName = 'users';
const moviecollectionName = 'movies';


router.get('/user/watching', (req, res) => {
    var movieCollection = req.db.get(moviecollectionName);
    var userCollection = req.db.get(usercollectionName);

    userCollection.findOne({
        _id: req.user
    }).then(user => {
        // create array which contains only the ids (without rating)
        var movielist = user.watching.map(watching => watching.movie_id);
        movieCollection.find({
            id: {
                $in: movielist
            }
        }).then(movies => {
            res.json(movies).status(200).end();
        })
    })
})

router.get('/user/watched', (req, res) => {
    var movieCollection = req.db.get(moviecollectionName);
    var userCollection = req.db.get(usercollectionName);

    userCollection.findOne({
        _id: req.user
    }).then(user => {
        // create array which contains only the ids (without rating)
        var movielist = user.watched.map(watched => watched.movie_id);
        movieCollection.find({
            id: {
                $in: movielist
            }
        }).then(movies => {
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

router.delete('/watchlist/remove', (req, res) => {
    if (req.user) {
        var userCollection = req.db.get(usercollectionName);
        console.log(req.body);
        userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is already in watchlist
            if ((user.watching.map(watching => watching.movie_id).includes(req.body.movie_id))) {
                console.log("It includes");
                console.log(user);
                userCollection.update({
                    _id: req.user
                }, {
                    $pull: {
                        watching: {
                            movie_id: req.body.movie_id
                        }
                    }
                }).then( result => console.log(result));
            }
        })
        res.end();
    }
})

router.delete('/watchedlist/remove', (req, res) => {
    if (req.user) {
        var userCollection = req.db.get(usercollectionName);
        userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is already in watchlist
            if ((user.watched.map(watched => watched.movie_id).includes(req.body.movie_id))) {
                userCollection.update({
                    _id: req.user
                }, {
                    $pull: {
                        watched: {
                            movie_id: req.body.movie_id,
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
        $text: {
            $search: search
        },
        // if genres in req.query create genre filter, else do nothing
        ...('genres' in req.query) && {
            genres: {
                $all: req.query.genres.split(',').map(genre => ({
                    $elemMatch: {
                        name: genre
                    }
                }))
            }
        },
        // if rating in req.query create rating filter, else do nothing
        ...('rating' in req.query) && {
            vote_average: {
                $gt: parseFloat(req.query.rating)
            }
        },
        // if year in req.query create rating filter, else do nothing
        ...('years' in req.query) && {
            release_date: {
                $gt: req.query.years.split(',')[0],
                $lt: (req.query.years.split(',')[1] + '-31-12')
            }
        }
    }

    var options = {
        fields: {},
        sort: {
            'popularity': -1
        },
        skip: req.get('page') * 20,
        limit: 20
    };

    movieCollection.find(query, options, function(error, rows) {
        res.json(rows).status(200).end();
    });
});

router.get('/search/popular', (req, res, next) => {
    // get mongodb collection from app.js, Collection is called tmdb in mongo database
    var movieCollection = req.db.get(moviecollectionName);

    var query = {
        // if genres in req.query create genre filter, else do nothing
        ...('genres' in req.query) && {
            genres: {
                $all: req.query.genres.split(',').map(genre => ({
                    $elemMatch: {
                        name: genre
                    }
                }))
            }
        },
        // if rating in req.query create rating filter, else do nothing
        ...('rating' in req.query) && {
            vote_average: {
                $gt: parseFloat(req.query.rating)
            }
        },
        // if year in req.query create rating filter, else do nothing
        ...('years' in req.query) && {
            release_date: {
                $gt: req.query.years.split(',')[0],
                $lt: (req.query.years.split(',')[1] + '-31-12')
            }
        }
    }

    var options = {
        sort: {
            'popularity': -1
        },
        skip: req.get('page') * 20,
        limit: 20
    };

    movieCollection.find(query, options, function(error, rows) {
        res.json(rows).status(200).end();
    });
});

module.exports = router;