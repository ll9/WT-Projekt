var express = require('express');
var router = express.Router();
var path = require('path');

const watching = "watching";
const watched = "watched";


function checkAuth(req, res, next) {
    if (!req.user) {
        res.status(401).end()
    } else {
        next();
    }
}

function getMoviesFromList(list) {
    return (req, res) => {
        req.userCollection.findOne({
            _id: req.user
        }).then(user => {
            req.movieCollection.find({
                id: {
                    $in: user[list].map(entry => entry.movie_id) // create array which contains only the ids (without rating)
                }
            }).then(movies => res.json(movies).status(200).end());
        })
    }
}

function addMovieToList(list) {
    return (req, res) => {
        req.userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is not already in watchlist
            if (!(user[list].map(entry => entry.movie_id).includes(req.body.movie_id))) {
                req.userCollection.update({
                    _id: req.user
                }, {
                    $push: {
                        [list]: {
                            movie_id: req.body.movie_id,
                            rating: null
                        }
                    }
                }).then(() => res.status(201).end())
            }
        })
    }
}

function removeMovieFromList(list) {
    return (req, res) => {
        req.userCollection.findOne({
            _id: req.user
        }).then(user => {
            // check if movie is already in watchlist
            if ((user[list].map(watching => watching.movie_id).includes(req.body.movie_id))) {
                req.userCollection.update({
                    _id: req.user
                }, {
                    $pull: {
                        [list]: {
                            movie_id: req.body.movie_id
                        }
                    }
                }).then(() => res.status(204).end())
            }
        })
    }
}


router.get('/user/watching', getMoviesFromList(watching));

router.get('/user/watched', getMoviesFromList(watched));

router.post('/watchlist/add', checkAuth, addMovieToList(watching));

router.post('/watchedlist/add', checkAuth, addMovieToList(watched));

router.delete('/watchlist/remove', checkAuth, removeMovieFromList(watching));

router.delete('/watchedlist/remove', checkAuth, removeMovieFromList(watched));


router.get('/search/movies/:movieName', (req, res, next) => {
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

    req.movieCollection.find(query, options, function(error, rows) {
        res.json(rows).status(200).end();
    });
});

router.get('/search/popular', (req, res, next) => {
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

    req.movieCollection.find(query, options, function(error, rows) {
        res.json(rows).status(200).end();
    });
});

module.exports = router;