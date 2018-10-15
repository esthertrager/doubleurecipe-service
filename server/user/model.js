const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: { type: String, index: { unique: true } },
    googleId: { type: String, index: { unique: true } },
    facebookId: { type: String, index: { unique: true } },
    email: String,
	createdDate: Date
});
	
const User = mongoose.model('User', userSchema);

const get = (query) => {
	query = query || {};
	console.log('query', query);
	return new Promise((resolve, reject) => {
		User.findOne(query || {}).exec((error, user) => {
			console.log(user);
			if (user) {
				resolve(user);
			} else {
				console.log(error);
				reject({
					status: 500,
					error
				});
			}
		});
	});
}

const findById = (_id) => {
	return get({ _id }).then((user) => user, (err) => {
		return {};
	});
}

const create = (_user) => {
	_user.createdDate = Date.now();
	_user.updatedDate = _user.createdDate;
	_user.name = Date.now();
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
				resolve(new User(__user));
			}
		});
	});
}

const update = (user) => {
	const _id = user._id;
	console.log("user", user);
	return new Promise((resolve, reject) => {
		if (user.name.length < 6) {
			const error = {};
			error.text = 'Username must be at least 6 characters.';
			error.status = 412;
			reject(error);

			return;
		}
		User.findOneAndUpdate({_id}, { 
			$set: {
					name: user.name,
					updatedDate: Date.now()
				}
			}, { new: true }, function(error, _user) {
	    
		    if (error) {
	        	console.log('Failed to query mongodb', error);
	        	
		    	if (error.code === 11000) {
		    		error.status = 409;
		    		error.text = 'Username exists.';
		    	} else {
		    		error.status = 500;
		    		error.text = 'Failed to update user.'
		    	}
				
				reject(error);
				
			} else {
				resolve(new User(_user));
			}
		});
	});
}

const findOrCreate = (query) => {
	return get(query).then((user) => {
		console.log('Found user', user);
		return user
	}, () => {
		console.log('User not found, creating user', query);
		return create(query);
	})
}

module.exports = {
	get, findById, create, findOrCreate, update
}