function RatedMovie(ratedMovie) {
	Movie.call(this, ratedMovie.movie[0])

	this.getPersonalRating = () => ratedMovie.rating;
}