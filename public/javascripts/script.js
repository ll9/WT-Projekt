$(document).ready(function () {
    $(".bs-select-all").on('click', function(event) {
        $('.selectpicker').selectpicker('toggle');        
        // Don't use the regular event (select all)
        event.stopPropagation();  
    });  
})


function Movie(movie) {
    this.getYear = () => movie.release_date.split('-')[0];
    this.getTitle = () => movie.title;
    this.getTitleYear = () => `${this.getTitle()} (${this.getYear()})`;
    this.isReleased = () => {
        let today = new Date();
        let release = new Date(movie.release_date)
        return today > release;
    }
    this.getGenres = () => movie.genres.map(obj => obj.name).join(", ");
    this.getDescription = () => movie.overview;
    this.getRating = () => this.isReleased() ? movie.vote_average: 'tbd';
    this.getImage = () => {
        const baseURL = "https://image.tmdb.org/t/p/";
        const picutreSize = "w150/";
        if (movie.poster_path == null)
            return "http://via.placeholder.com/150x240";
        return baseURL + picutreSize + movie.poster_path;
    };
    this.getTrailer = () => {
        const baseURL = "https://www.youtube.com/watch?v=";
        if (movie.videos.results.length === 0) 
            return null;
        else
            return baseURL + movie.videos.results[0].key
    };
    this.getActors = () => movie.credits.cast.slice(0, 4);
    this.getActorLink = (actor) => {
        const baseURL="https://www.themoviedb.org/person/";
        return baseURL+actor.id+'-'+actor.name.replace(' ', '-');
    }
}

var mv = new Vue({
    el: '#app',
    data: {
        yearValue: [1900, 2018],
        yearOptions: {
            min: 1900,
            max: 2018
        },
        ratingValue: 0,
        ratingOptions: {
            min: 0,
            max: 10,
            interval: 0.1
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
        currentMovies: [],  // All movies found by the db
        displayedMovies: [], // Movies which are displayed on the website (endless scrolling)
    },

    mounted: function() {
        this.getMovieByURL('/search/popular')
    },
    
    methods: {
        // gets Movie from the database and inserts them into current movie
        // take a look at index.js to see how the db provides the data
        getMovieByURL: function(url) {

            this.$http.get(url).then(resp => {
                this.currentMovies = [];
                
                for (movie of resp.body) {
                    this.$data.currentMovies.push(
                        new Movie(movie)
                    );
                }
                this.displayedMovies = this.currentMovies.slice(0, 10);
            });
        },
        searchMovies: function() {
            var baseURL = '/search/movies/' + this.searchText;
            var query = '?' +
                (this.selected.length != 0 ? "&genres="+this.selected : '') + 
                (this.ratingValue > 0 ? "&rating="+this.ratingValue : '') +
                (this.yearValue[0] != 1900 || this.yearValue[1] != 2018 ? 
                    "&years="+this.yearValue : '');

            this.getMovieByURL(baseURL + query);
        },
        infiniteHandler($state) {
            console.log("infinite Handler");
            setTimeout(() => {
                let len = this.displayedMovies.length + 5;
                for (let i = this.displayedMovies.length; i < len && i < this.currentMovies.length; i++) {
                    this.displayedMovies.push(this.currentMovies[i]);
                    console.log(`i: ${i} displaylength: ${this.displayedMovies.length} curlen: ${this.currentMovies.length}`);
                }
                $state.loaded();
            }, 1000);
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