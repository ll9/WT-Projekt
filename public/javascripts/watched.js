const Watched = Vue.component('Watched', {
    template: `
    <div>
        <h2 style="text-align:center">Watchedlist</h2>
        <sort v-on:sort-request="sortMovies"></sort>
        <watchlist v-for="movie of movies" :movie="movie" listname="watchedlist" swapname="watchlist" :key="movie.getId()" 
        v-on:delete-movie="deleteMovie">
            <i slot="swapicon" class="fa fa-eye" aria-hidden="true" style="font-size:40px; cursor:pointer;"></i>
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
            this.movies.splice(this.movies.indexOf(movie), 1);
        }
    }
});