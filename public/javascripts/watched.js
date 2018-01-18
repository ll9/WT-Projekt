const Watched = Vue.component('Watched', {
    template: `
    <div>
        <h2 style="text-align:center">Watchedlist</h2>
        <watchlist v-for="movie of movies" :movie="movie" listname="watchlist" :key="movie.getId()" 
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
        this.$http.get('/api/user/watched').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new RatedMovie(movie));
            }
        }, error => location = '/auth/google')
    },
    methods: {
        deleteMovie: function(movie) {
            this.$http.delete('/api/watchedlist/remove', {
                body: {
                    movie_id: movie.getId()
                }
            }).then(resp => this.movies.splice(this.movies.indexOf(movie), 1),
                error => location = '/auth/google')
        }
    }
});