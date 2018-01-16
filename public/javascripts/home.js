 const Home = Vue.component('Home', {
     template: `
    <div>
        <search v-on:search-request="loadMovies"></search>
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
             state: Store.state,
             watching: [],
             watched: []
         }
     },

     watch: {
         state: {
             immediate: true,
             // when the user is confirmed to be logged in get watchlist info (to display tooltips etc)
             handler: function() {
                 if (this.state.isLoggedIn && !this.state.changedAuth) {
                     this.$http.get('/api/user/watching').then(resp => {
                         for (movie of resp.body) {
                             this.watching.push(movie.id);
                         }
                     }, error => this.state.isLoggedIn = false)
                     this.$http.get('/api/user/watched').then(resp => {
                         for (movie of resp.body) {
                             this.watched.push(movie.id);
                         }
                     }, error => this.state.isLoggedIn = false)
                 }
             },
             deep: true
         }
     },

     mounted: function() {
         this.$refs.infiniteLoading.debounceDuration = 5;
     },

     methods: {
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
                     'page': (this.movies.length / 20).toString()
                 }
             }).then(resp => {
                 if (resp.body.length === 0)
                     $state.complete();
                 for (movie of resp.body) {
                     this.movies.push(new Movie(movie));
                 }
                 $state.loaded();
             })
         },
     },
     components: {
         'infinite-loading': window.VueInfiniteLoading.default,
     }
 });