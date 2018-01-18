const router = require('express').Router();
const monk = require('monk');


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
        console.log(req.user);
        req.userCollection.aggregate([{
            $match: {
                _id: monk.id(req.user)
            }
        }, {
            $unwind: "$" + list
        }, {
            $replaceRoot: {
                newRoot: "$" + list
            }
        }, {
            $lookup: {
                from: "movies",
                localField: "movie_id",
                foreignField: "id",
                as: "movie"
            }
        }]).then(movies => res.json(movies).status(200).end());
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
                            rating: req.body.rating
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

function rateMovie(list) {
    return (req, res) => {
        req.userCollection.findOneAndUpdate({
            _id: req.user,
            [list+".movie_id"]: req.body.movie_id
        }, {
            $set: {
                [list+".$.rating"]: req.body.rating
            }
        })
        res.status(200).end();
    }
}


router.get('/user/watching', checkAuth, getMoviesFromList(watching));

router.get('/user/watched', checkAuth, getMoviesFromList(watched));

router.post('/watchlist/add', checkAuth, addMovieToList(watching));

router.post('/watchedlist/add', checkAuth, addMovieToList(watched));

router.delete('/watchlist/remove', checkAuth, removeMovieFromList(watching));

router.delete('/watchedlist/remove', checkAuth, removeMovieFromList(watched));

router.post('/watchlist/rate', checkAuth, rateMovie(watching));

router.post('/watchedlist/rate', checkAuth, rateMovie(watched));

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