const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    password: String,
		createdDate: Date
});

const User = mongoose.model('User', userSchema);
const getUserInstance = (user) => new User(user).toJSON({ virtuals: true });

const get = (query) => {
	query = query || {};
	return new Promise((resolve, reject) => {
		User.find(query || {}).exec((error, users) => {
			resolve(users.map(getUserInstance));
		});
	});
}

const findById = (_id) => {
	return get({ _id }).then(users => users[0])
}

const update = (user) => {
	const _id = user._id;

	return new Promise((resolve, reject) => {
		User.findOneAndUpdate({_id}, { $set: {
					directions: user.directions,
					name: user.name,
					ingredients: user.ingredients,
					total: user.total,
					updatedDate: Date.now()
				}}, { new: true }, function(error, _user){
	    if (error){
        console.log('Failed to query mongodb', error);
				reject({
					status: 500,
					error
				});
			} else {
				resolve(getUserInstance(_user));
			}
		});
	});
}

const remove = (_id) => {
	return new Promise((resolve, reject) => {
		User.remove({ _id }, function (error) {
		  if (error) {
		  	reject({
					status: 500,
					error
				})
		  } else {
			  resolve({})
		  }
		});
	});
}

const create = (_user) => {
	_user.createdDate = Date.now();
	_user.updatedDate = _user.createdDate;
	const user = new User(_user);

	return new Promise((resolve, reject) => {
		user.save((error, __user) => {
			if (error) {
				console.log('Failed to insert user', error);
				reject({
					status: 500,
					error
				});
			} else {
				resolve(getUserInstance(__user));
			}
		});
	});
}

module.exports = {
	get, create, findById, update, remove
}