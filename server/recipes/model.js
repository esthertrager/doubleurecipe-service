const mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    name: String,
    ingredients: {
    	type: Array,
    	default: []
    },
    total: {
    	amount: {
    		type: Number,
    		default: null
    	},
    	unit: {
    		type: String,
    		default: null
    	}
    },
    directions: {
    	type: String,
    	default: ''
    },
    owner: {
    	type: String,
    	default: 'esther'
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
const getRecipeInstance = (recipe) => new Recipe(recipe).toJSON({ virtuals: true });

const get = (query) => {
	query = query || {};
	return new Promise((resolve, reject) => {
		Recipe.find(query || {}).exec((error, recipes) => {
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
					name: recipe.name,
					ingredients: recipe.ingredients
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