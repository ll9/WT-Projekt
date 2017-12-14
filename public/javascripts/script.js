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
    methods: {
        // gets Movie from the database and inserts them into current movie
        // take a look at index.js to see how the db provides the data
        searchMovies: function() {
            var query = '?' +
                (this.selected.length != 0 ? "genres="+this.selected : '');


            this.$http.get('/search/' + this.$data.searchText + query).then(resp => {
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
        }
    }
});
