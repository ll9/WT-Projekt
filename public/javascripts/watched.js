const Watched = Vue.component('Watched', {
    template: `
    <div>
        <h2 style="text-align:center">Watchedlist</h2>
        <sort :options="sortOptions" v-on:sort-request="sortMovies"></sort>
        <watchlist v-for="movie of sortedMovies" :movie="movie" listname="watchedlist" swapname="watchlist" :key="movie.getId()" 
        v-on:delete-movie="deleteMovie">
            <i slot="swapicon" class="fa fa-eye" aria-hidden="true" style="font-size:40px; cursor:pointer;"></i>
        </watchlist>
        <infinite-loading ref="infiniteLoading" v-bind:distance="500" spinner="spiral" v-on:infinite="infiniteHandler">
            <span slot="no-more">{{movies.length? "": "Nothing Found"}}</span>
        </infinite-loading>
    </div>
    `,
    data: function() {
        return {
            movies: [],
            state: Store.state,
            sort: 'Popularity',
            sortOptions: ['Popularity', 'Date', 'Title', 'Rating', 'Personal Rating'],
            arrangement: -1,
        }
    },
    computed: {
        sortedMovies: function() {
            switch(this.sort) {
                case 'Date': return _.orderBy(this.movies, [(movie) => movie.getDate()], [this.arrangement===-1? 'desc': 'asc']);
                case 'Popularity': return _.orderBy(this.movies, [(movie) => movie.getPopularity()], [this.arrangement===-1? 'desc': 'asc']);
                case 'Title': return _.orderBy(this.movies, [(movie) => movie.getTitle()], [this.arrangement===-1? 'desc': 'asc']);
                case 'Rating': return _.orderBy(this.movies, [(movie) => movie.getRating()], [this.arrangement===-1? 'desc': 'asc']);
                case 'Personal Rating': return _.orderBy(this.movies, [(movie) => movie.getPersonalRating() || 0], [this.arrangement===-1? 'desc': 'asc']);
            }
        }
    },
    methods: {
        deleteMovie: function(movie) {
            this.movies.splice(this.movies.indexOf(movie), 1);
        },
        sortMovies: function(by, arrangement) {
            this.sort = by;
            this.arrangement = arrangement;
        },
        infiniteHandler: function($state) {
            this.$http.get('/api/user/watched').then(resp => {
                for (movie of resp.body) {
                    this.movies.push(new RatedMovie(movie));
                    console.log(this.movies.length)
                }
                $state.loaded();
                $state.complete();
            }, error => location = '/auth/google')
        }
    },
    components: {
         'infinite-loading': window.VueInfiniteLoading.default,
     }
});