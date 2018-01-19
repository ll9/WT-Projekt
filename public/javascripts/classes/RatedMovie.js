function RatedMovie(ratedMovie) {
	Movie.call(this, ratedMovie.movie)

	this.getPersonalRating = () => ratedMovie.rating;
}