function RatedMovie(ratedMovie) {
	Movie.call(this, ratedMovie.movie)

	this.getPersonalRating = () => ratedMovie.rating;
	this.setPersonalRating = pr => ratedMovie.rating=pr;
}