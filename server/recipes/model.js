const mongoConnect = require('../mongoConnect');
var ObjectId = require('mongodb').ObjectID;

const get = (query) => {
	query = query || {};
	return new Promise((resolve, reject) => {
		mongoConnect().then((db) => {
			db.collection('recipes').find(query, function(error, result) {
					if (error) {
						console.log('Failed to query mongodb', error);
						resolve({});
					}
			    const recipes = result.map((recipe) => {
			    	recipe.id = recipe._id;
			    	return recipe;
			    }).toArray((error, results) => {
			    	if (error) {
			    		console.log('Failed to convert evo beta recipes to array', error);
			    		reject({
								status: 500,
								error
							});
			    	}

			    	resolve(results);
			    });
			  });
		});
	});
}

const findById = (id) => {
	return get({_id: id}).then(recipes => recipes[0])
}

const update = (recipe) => {
	const _id = new ObjectId(recipe._id);

	return new Promise((resolve, reject) => {
		mongoConnect().then((db) => {
			db.collection('recipes').updateOne({_id}, {$set: {
				name: recipe.name,
				ingredients: recipe.ingredients
			}}, function(error, result) {
					if (error) {
						console.log('Failed to query mongodb', error);
						reject({
							status: 500,
							error
						});
					}
			    findById(_id).then((_recipe) => {
			    	resolve(_recipe);
			    });
			  });
		});
	});
}

const remove = (recipeId) => {
	const _id = new ObjectId(recipeId);

	return new Promise((resolve, reject) => {
		mongoConnect().then((db) => {
			db.collection('recipes').deleteOne({_id}, function(error, result) {
					if (error) {
						console.log('Failed to delete', recipe, error);
						reject({
							status: 500,
							error
						});
					}
			    resolve({})
			  });
		});
	});
}

const create = (recipe) => {
	return new Promise((resolve, reject) => {
		mongoConnect().then((db) => {
			db.collection('recipes').insertOne(recipe, function(error, result) {
					if (error) {
						console.log('Failed to insert recipe', error);
						reject({
							status: 500,
							error
						});
					}

					const recipe = result.ops[0];
					recipe.id = recipe._id;
					resolve(recipe);
			  });
		});
	});
}

module.exports = {
	get, create, findById, update, remove
}