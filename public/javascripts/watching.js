const Watching = Vue.component('Watching', {
    template: `
    <div>
        <h2 style="text-align:center">Watchinglist</h2>
        <sort v-on:sort-request="sortMovies"></sort>
        <watchlist v-for="movie of sortedMovies" :movie="movie" listname="watchlist" swapname="watchedlist" :key="movie.getId()" 
        v-on:delete-movie="deleteMovie">
            <i slot="swapicon" class="fa fa-check-square-o" aria-hidden="true" style="font-size:40px; cursor:pointer; padding-top: 8px;"></i>
        </watchlist>
    </div>
    `,
    data: function() {
        return {
            movies: [],
            state: Store.state,
            sort: 'popularity',
            arrangement: -1,
        }
    },
    computed: {
        sortedMovies: function() {
            sortedMovies = [];
            switch(this.sort) {
                case 'release_date': sortedMovies = _.sortBy(this.movies, [(movie) => movie.getDate()]); break;
                case 'popularity': sortedMovies = _.sortBy(this.movies, [(movie) => movie.getPopularity()]); break;
                case 'title': sortedMovies = _.sortBy(this.movies, [(movie) => movie.getTitle()]); break;
                case 'vote_average': sortedMovies = _.sortBy(this.movies, [(movie) => movie.getRating()]); break;
            }
            if (this.arrangement === -1)
                sortedMovies.reverse();
            return sortedMovies
            /*
            console.log(_.sortBy(this.movies, [(movie) => movie.getYear()]))
            return _.sortBy(this.movies, [(movie) => movie.getTitle()])
            */
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
        },
        sortMovies: function(by, arrangement) {
            this.sort = by;
            this.arrangement = arrangement;
        }
    }
});