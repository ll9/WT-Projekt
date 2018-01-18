const Watching = Vue.component('Watching', {
    template: `
    <div>
        <h2 style="text-align:center">Watchinglist</h2>
        <watchlist v-for="movie of movies" :movie="movie" listname="watchlist" :key="movie.getId()" 
        v-on:delete-movie="deleteMovie">
            <i slot="swapicon" class="fa fa-check-square-o" aria-hidden="true" style="font-size:40px; cursor:pointer;"></i>
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
        deleteMovie: function(movie) {
            this.movies.splice(this.movies.indexOf(movie), 1);
        }
    }
});