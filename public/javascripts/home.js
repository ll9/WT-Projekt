 const Home = Vue.component('Home', {
     template: `
    <div>
        <search v-on:search-request="loadMovies"></search>
        <sort v-if="!noResult" :options="Object.keys(dictionary)" v-on:sort-request="sortMovies"></sort>
        <movie-field v-for="(movie, index) of movies" :movie="movie" :watching="watching" :watched="watched" :state="state" v-bind:key="index"></movie-field>
        <infinite-loading ref="infiniteLoading" v-bind:distance="500" spinner="waveDots" @infinite="infiniteHandler">
            <span slot="no-more">{{movies.length? "": "Nothing Found"}}</span>
        </infinite-loading>
    </div>
    `,
     data: function() {
         return {
             movies: [],
             url: '/api/search/movies?',
             sort: 'popularity',
             arrangement: -1,
             state: Store.state,
             noResult: false,
             watching: [],
             watched: [],
             // convert selected text to text which the database can handle
             dictionary: {
                "Popularity": "popularity",
                "Title": "title",
                "Rating": "vote_average",
                "Date": "release_date"
            }
         }
     },

     watch: {
         state: {
             immediate: true,
             // when the user is confirmed to be logged in get watchlist info (to display tooltips etc)
             handler: function() {
                 if (this.state.isLoggedIn && !this.state.changedAuth) {
                     this.$http.get('/api/user/watching').then(resp => {
                         for (ratedMovie of resp.body) {
                             this.watching.push(ratedMovie.movie.id);
                         }
                     }, error => this.state.isLoggedIn = false)
                     this.$http.get('/api/user/watched').then(resp => {
                         for (ratedMovie of resp.body) {
                             this.watched.push(ratedMovie.movie.id);
                         }
                     }, error => this.state.isLoggedIn = false)
                 }
             },
             deep: true
         }
     },

     methods: {
        // Triggers infiniteHandler to sort
        sortMovies: function(by, arrangement) {
            this.movies = [];
            this.sort = this.dictionary[by];
            this.arrangement = arrangement;
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        },
        // Triggers infiniteHandler with proper url
         loadMovies: function(url) {
             this.movies = [];
             this.url = url;
             this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
         },
         // gets Movie from the database and inserts them into movies
         infiniteHandler($state) {
             this.$http.get(this.url, {
                 headers: {
                     'page': (this.movies.length / 20).toString(),
                     'sort': this.sort,
                     'arrangement': this.arrangement.toString()
                 }
             }).then(resp => {
                 if (resp.body.length === 0) {
                     $state.complete();
                 }
                 for (movie of resp.body) {
                     this.movies.push(new Movie(movie));
                 }
                 $state.loaded();
                 this.noResult = (this.movies.length == 0? true: false)
             })
         },
     },
     components: {
         'infinite-loading': window.VueInfiniteLoading.default,
     }
 });