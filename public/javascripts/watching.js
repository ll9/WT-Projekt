const Watching = Vue.component('Watching', {
    template: `
    <div>
        <h2 style="text-align:center">Watchinglist</h2>
        <watchlist v-for="movie of movies" :movie="movie" :key="movie.getId()" 
        v-on:rating-request="saveRating"
        v-on:delete-movie="deleteMovie">
        </watchlist>
    </div>
    `,
    data: function() {
        return {
            movies: [],
            state: Store.state
        }
    },
    mounted: function() {
        this.$http.get('/api/user/watching').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new RatedMovie(movie));
            }
        }, error => location = '/auth/google')
    },
    methods: {
        saveRating: function(id, rating) {
            this.$http.post('/api/watchlist/rate', {
                movie_id: id,
                rating: rating
            }).then(resp => {},
                error => location = '/auth/google')
        },
        deleteMovie: function(movie) {
            this.$http.delete('/api/watchlist/remove', {
                body: {
                    movie_id: movie.getId()
                }
            }).then(resp => this.movies.splice(this.movies.indexOf(movie), 1),
                error => location = '/auth/google')
        }
    }
});