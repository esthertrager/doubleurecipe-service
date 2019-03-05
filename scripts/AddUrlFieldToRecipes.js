var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/dur';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  findRecipesWithoutUrl(db, function(recipesWithoutUrl) {
  	addUrlToRecipes(db, recipesWithoutUrl, function() {
	  db.close();
  	})
  });
});


var findRecipesWithoutUrl = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('recipes');
  // Find some documents
  collection.find({url: {
  	$exists: false
  }}).toArray(function(err, recipesWithoutUrl) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(recipesWithoutUrl)
    callback(recipesWithoutUrl);
  });
}

var addUrlToRecipes = function(db, recipesWithoutUrl, callback) {
	var collection = db.collection('recipes');
	// loop through recipesWithoutUrl
	// add url field to each recipeWithoutUrl and update in db

	recipesWithoutUrl.forEach(function(recipeWithoutUrl) {
		recipeWithoutUrl.url = recipeWithoutUrl.name;
		recipeWithoutUrl.url = recipeWithoutUrl.url.replace(/\s+/g, '-').toLowerCase();
		console.log(recipeWithoutUrl);
		updateRecipe(db, recipeWithoutUrl, function() {
			db.close();
		});
	});
}

var updateRecipe = function(db, recipe, callback) {
  // Get the documents collection
  var collection = db.collection('recipes');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ _id : recipe._id }
    , { $set: { url : recipe.url } }, function(err, result) {
    //assert.equal(err, null);
    //assert.equal(1, result.result.n);
    console.log("Updated the document with a url field");
    callback(result);
  });  
}