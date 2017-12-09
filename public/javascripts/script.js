
function Movie(title, genres, description, rating, image, trailer, actors) {
    this.getTitle = () => {return title;}
    this.getGenres = () => {return genres;}
    this.getDescription = () => {return description;}
    this.getRating = () => {return rating;}
    this.getImage = () => {return image;}
    this.getTrailer = () => {return trailer;}
    this.getActors = () => {return actors;}
}

new Vue({
    el: '#app',
    data: {
        selected: '',
        searchText: '',
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
        searchMovies: function() {
            this.$http.get('/search/' + this.$data.searchText).then(resp => {
                this.$data.currentMovies = [];
                
                for (movie of resp.body) {
                    this.$data.currentMovies.push(
                        //new Movie(movie.title, movie.genres.map(obj => obj.name).join(", "), movie.overview,
                        //    movie.vote_average, movie.poster_path, movie.videos, movie.credits)
                        new Movie(movie.title, movie.genres.map(obj => obj.name).join(", "), movie.overview,
                            movie.vote_average, null, null, movie.credits.cast.slice(0, 4).map(obj => obj.name).join(", "))
                    );
                }
                console.log(this.$data.currentMovies);
            });
        }
    }
});
