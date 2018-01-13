const router = require('express').Router();


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

router.get('/search/movies/:movieName?', (req, res, next) => {

    // Build mongo query conditionally with the spread (...) operator
    const query = {
        // if movieName in req.params create serach by title
        ...(req.params.movieName) && {
            $text: {
                $search: "\"" + req.params.movieName + "\"" //search whole phrase
            }
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
        ...('rating' in req.query) && {
            vote_average: {
                $gt: parseFloat(req.query.rating)
            }
        },
        ...('years' in req.query) && {
            release_date: {
                $gt: req.query.years.split(',')[0],
                $lt: (req.query.years.split(',')[1] + '-31-12')
            }
        }
    }

    const options = {
        sort: {
            'popularity': -1
        },
        skip: req.get('page') * 20,
        limit: 20
    };

    req.movieCollection.find(query, options)
        .then(result => res.json(result).status(200).end());
});


module.exports = router;