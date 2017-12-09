
function Movie(title, genre, description, rating, image, trailer, actors) {
    this.getTitle = () => {return title;}
    this.getGenre = () => {return genre;}
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
        ]
    }
});
