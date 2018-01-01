 const Home = Vue.component('Home', {
     template: `
    <div>
        <!--statische Elemente, können für Watchlist übernommen werden-->
        <sidebar :is-logged-in="isLoggedIn"></sidebar>

        <!-- Google Authentication -->
        <!-- https://developers.google.com/identity/sign-in/web/sign-in -->

        <!--Suchfunktionen-->
        <search v-on:search-request="loadMovies"></search>

        <!--Filmanzeige-->
        <movie-field v-for="(movie, index) of movies" :movie="movie" :is-logged-in="isLoggedIn" v-bind:key="index"></movie-field>
        <infinite-loading ref="infiniteLoading" v-bind:distance="500" spinner="waveDots" @infinite="infiniteHandler">
            <span slot="no-more">{{movies.length? "": "Nothing Found"}}</span>
        </infinite-loading>
    </div>
    `,
     data: function() {
         return {
             movies: [],
             url: '/api/search/popular?',
             isLoggedIn: false,
         }
     },

     created: function() {
         // check if user is logged in
         this.$http.get('/auth/sessionStatus').then(resp => {
             this.isLoggedIn = resp.body ? true : false;
         })
     },

     mounted: function() {
         this.$refs.infiniteLoading.debounceDuration = 5;
     },

     methods: {
         loadMovies: function(url) {
             this.movies = [];
             this.url = url;
             this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
         },
         // gets Movie from the database and inserts them into current movie
         // take a look at index.js to see how the db provides the data
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