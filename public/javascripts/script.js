$(document).ready(function () {
    $(".bs-select-all").on('click', function(event) {
        $('.selectpicker').selectpicker('toggle');        
        // Don't use the regular event (select all)
        event.stopPropagation();  
    });  
})


function Movie(title, genres, description, rating, image, trailer, actors) {
    this.getTitle = () => {return title;}
    this.getGenres = () => {return genres;}
    this.getDescription = () => {return description;}
    this.getRating = () => {return rating;}
    this.getImage = () => {return image;}
    this.getTrailer = () => {return trailer;}
    this.getActors = () => {return actors;}
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
            'Sci-Fi',
            'Short',
            'Sport',
            'Thriller',
            'War',
            'Western'
        ],
        currentMovies: []
    },

    mounted: function() {
        this.getMovieByURL('/search/popular')
    },
    
    methods: {
        // gets Movie from the database and inserts them into current movie
        // take a look at index.js to see how the db provides the data
        getMovieByURL: function(url) {

            this.$http.get(url).then(resp => {
                this.$data.currentMovies = [];
                
                for (movie of resp.body) {
                    this.$data.currentMovies.push(
                        new Movie(movie.title,
                            movie.genres.map(obj => obj.name).join(", "),
                            movie.overview,
                            movie.vote_average, 
                            "https://image.tmdb.org/t/p/" + "w150/" + movie.poster_path,
                            movie.videos.results.length === 0 ? null: "https://www.youtube.com/watch?v=" + movie.videos.results[0].key,           
                            movie.credits.cast.slice(0, 4).map(obj => obj.name).join(", "))
                    );
                }
            });
        },
        searchMovies: function() {
            var baseURL = '/search/movies/' + this.searchText;
            var query = '?' +
                (this.selected.length != 0 ? "genres="+this.selected : '');

            this.getMovieByURL(baseURL + query);
        }
    },
    components: {
    'vueSlider': window[ 'vue-slider-component' ],
  }
});
