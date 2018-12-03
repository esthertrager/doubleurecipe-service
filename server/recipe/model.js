const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var recipeSchema = mongoose.Schema({
		createdDate: Date,
    name: String,
    directions: {
    	type: String,
    	default: ''
    },
    ingredients: {
    	type: Array,
    	default: []
    },
    owner: {
    	type: Schema.ObjectId,
    	ref: 'User'
    },
    total: {
    	quantity: {
    		type: Number,
    		default: null
    	},
    	unit: {
    		type: String,
    		default: null
    	}
    },
    updatedDate: Date,
    url: String
});

recipeSchema.index({ name: 1, url: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);
const getRecipeInstance = (recipe) => new Recipe(recipe).toJSON({ virtuals: true });

const get = (query) => {
	query = query || {};
	return new Promise((resolve, reject) => {
		Recipe
			.find(query || {})
			.populate('owner')
			.exec((error, recipes) => {
			resolve(recipes.map(getRecipeInstance));
		});
	});
}

const findById = (_id) => {
	return get({ _id }).then(recipes => recipes[0])
}

const update = (recipe) => {
	const _id = recipe._id;

	return new Promise((resolve, reject) => {
		Recipe.findOneAndUpdate({_id}, { $set: {
					directions: recipe.directions,
					name: recipe.name,
					ingredients: recipe.ingredients,
					total: recipe.total,
					updatedDate: Date.now()
				}}, { new: true }, function(error, _recipe){
	    if (error){
        console.log('Failed to query mongodb', error);
				reject({
					status: 500,
					error
				});
			} else {
				resolve(getRecipeInstance(_recipe));
			}
		});
	});
}

const remove = (_id) => {
	return new Promise((resolve, reject) => {
		Recipe.remove({ _id }, function (error) {
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

const create = (_recipe) => {
	_recipe.createdDate = Date.now();
	_recipe.updatedDate = _recipe.createdDate;
	_recipe.url = _recipe.name;
	_recipe.url = _recipe.url.replace(/\s+/g, '-').toLowerCase();
	const recipe = new Recipe(_recipe);

	return new Promise((resolve, reject) => {
		recipe.save((error, __recipe) => {
			if (error) {
				console.log('Failed to insert recipe', error);
				reject({
					status: 500,
					error
				});
			} else {
				resolve(getRecipeInstance(__recipe));
			}
		});
	});
}

module.exports = {
	get, create, findById, update, remove
}