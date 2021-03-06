function Movie(movie) {
    this.getId = () => movie.id;
    this.getYear = () => movie.release_date.split('-')[0];
    this.getTitle = () => movie.title;
    this.getTitleYear = () => `${this.getTitle()} (${this.getYear()})`;
    this.getTitleLink = () => 'https://www.themoviedb.org/movie/' + movie.id;
    this.getPopularity = () => movie.popularity
    this.getGenres = () => movie.genres.map(obj => obj.name).join(", ");
    this.getDescription = () => movie.overview;
    this.getRating = () => this.isReleased() ? movie.vote_average : 'tbd';
    this.getDate = () => new Date(movie.release_date);
    this.isReleased = () => {
        let today = new Date();
        let release = new Date(movie.release_date)
        return today > release;
    }
    this.getImage = () => {
        const baseURL = "https://image.tmdb.org/t/p/";
        const picutreSize = "w154/";
        if (movie.poster_path == null)
            return "http://via.placeholder.com/150x240";
        return baseURL + picutreSize + movie.poster_path;
    }
    this.getTrailer = () => {
        const baseURL = "https://www.youtube.com/watch?v=";
        if (movie.videos.results.length === 0)
            return null;
        else
            return baseURL + movie.videos.results[0].key;
    }
    this.getActors = () => movie.credits.cast.slice(0, 4);
    this.getActorLink = (actor) => {
        const baseURL = "https://www.themoviedb.org/person/";
        return baseURL + actor.id + '-' + actor.name.replace(/ /g, '-');
    }
}