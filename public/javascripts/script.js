var mv = new Vue({
    el: '#app',
    data: {

        currentMovies: [],
        url: '/search/popular?',
        isLoggedIn: false,
    },

    created: function() {
        // check if user is logged in
        this.$http.get('/auth/sessionStatus').then(resp => {
            this.isLoggedIn = resp.body? true: false;
        })
    },

    mounted: function() {
        this.$refs.infiniteLoading.debounceDuration = 5;
    },

    methods: {
        loadMovies: function(url) {
            this.currentMovies = [];
            this.url = url;
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        },
        // gets Movie from the database and inserts them into current movie
        // take a look at index.js to see how the db provides the data
        infiniteHandler($state) {
            this.$http.get(this.url, {headers: {'page': (this.currentMovies.length/20).toString()}}).then(resp => {
                if (resp.body.length === 0)
                    $state.complete();
                for (movie of resp.body) {
                    this.currentMovies.push(new Movie(movie));
                }
                $state.loaded();
            })
        },
    },
    components: {
    'infinite-loading': window.VueInfiniteLoading.default,
  }
});
