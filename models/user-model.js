const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	user_id: String,
	watching: [{
		movie_id: String,
		rating: Number
	}],
	watched: [{
		movie_id: String,
		rating: Number
	}]
});

const User = mongoose.model('user', userSchema);

module.exports = User;