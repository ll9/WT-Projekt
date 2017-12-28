$(window).on('load', function() {
    $(".bs-select-all").on('click', function(event) {
        $('.selectpicker').selectpicker('toggle');
        // Don't use the regular event (select all)
        event.stopPropagation();
    });
});


var mv = new Vue({
    el: '#app',
    data: {
        yearValue: [1900, 2018],
        yearOptions: {
            min: 1900,
            max: 2018,
            tooltip: false
        },
        ratingValue: 0,
        ratingOptions: {
            min: 0,
            max: 10,
            interval: 0.1,
            tooltip: false
        },
        selected: [],
        searchText: '',
        year: 1950,
        rating: 50,
        genres: [
            'Action',
            'Adventure',
            'Animation',
            'Biography',
            'Comedy',
            'Crime',
            'Documentary',
            'Drama',
            'Family',
            'Fantasy',
            'History',
            'Horror',
            'Music',
            'Mystery',
            'Romance',
            'Science Fiction',
            'Short',
            'Sport',
            'Thriller',
            'War',
            'Western'
        ],
        currentMovies: [],
        url: '/search/popular?',
        isLoggedIn: false,
    },
    mounted: function() {
        this.$refs.infiniteLoading.debounceDuration = 5;
        if ("google_id_token" in localStorage) 
            this.isLoggedIn = true;
    },

    methods: {
        setURL: function() {
                this.url = '/search/' + 
                (this.searchText? `movies/${this.searchText}`: 'popular') +
                 '?' +
                (this.selected.length ? `&genres=${this.selected}` : '') +
                (this.ratingValue ? `&rating=${this.ratingValue}` : '') +
                (this.yearValue ? `&years=${this.yearValue}` : '');
        },
        loadMovies: function() {
            this.currentMovies = [];
            this.setURL()
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
    'vueSlider': window[ 'vue-slider-component' ],
    'infinite-loading': window.VueInfiniteLoading.default,
  }
});
/*
// Google backend Authentication with XHR
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
}

var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://yourbackend.example.com/tokensignin');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
};
xhr.send('idtoken=' + id_token);


// Using Google API Client Libary
// Node.js: $ npm install google-auth-libary --save
// https://developers.google.com/identity/sign-in/web/backend-auth
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');
client.verifyIdToken(
    token,
    CLIENT_ID,
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function(e, login) {
        var payload = login.getPayload();
        var userid = payload['sub'];
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
    });

// auth2 load
gapi.load('auth2', function()){
    gapi.auth2.init();
}
*/
// https://github.com/GoogleChromeLabs/google-sign-in?utm_campaign=identity_series_samplecode_030916&utm_source=gdev&utm_medium=yt-annt