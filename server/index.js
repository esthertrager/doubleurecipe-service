const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');

const dataFile = 'recipes.json';

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/recipes', function (req, res) {
	fs.readFile(dataFile, (err, data) => {
	  if (err) throw err;
	  res.send(JSON.parse(data));
	});
});

app.get('/recipes/:id', function (req, res) {
	fs.readFile(dataFile, (err, data) => {
	  if (err) throw err;
	  const recipes = JSON.parse(data);
	  const recipe = recipes.find((_recipe) => {
	  	return _recipe.id === parseInt(req.params.id);
	  });

	  res.send(recipe);
	});
});

app.post('/recipes', function (req, res) {
	const recipe = req.body;
	fs.readFile(dataFile, (err, data) => {
	  if (err) throw err;
	  const recipes = JSON.parse(data);
	  const id = Date.now();
	  recipe.id = id;
	  recipes.push(recipe);
	  fs.writeFile(dataFile, JSON.stringify(recipes, null, 2), (err) => {
	  	if (err) throw err;
	  	res.send(recipe);
	  });
	})
});

app.put('/recipes/:id', function (req, res) {
	const recipe = req.body;
	fs.readFile(dataFile, (err, data) => {
	  if (err) throw err;
	  const recipes = JSON.parse(data);
	  const id = parseInt(req.params.id);
	  const index = recipes.findIndex((_recipe) => {
	  	return _recipe.id === id;
	  });
	  recipes[index] = recipe;
	  fs.writeFile(dataFile, JSON.stringify(recipes, null, 2), (err) => {
	  	if (err) throw err;
	  	res.send(recipe);
	  });
	})
});

app.delete('/recipes/:id', function (req, res) {
	fs.readFile(dataFile, (err, data) => {
	  if (err) throw err;
	  const recipes = JSON.parse(data);
	  const id = parseInt(req.params.id);
	  const index = recipes.findIndex((_recipe) => {
	  	return _recipe.id === id;
	  });
	  console.log(`Found recipe with id = ${id} at index ${index}`);
	  recipes.splice(index, 1);
	  console.log(recipes);
	  fs.writeFile(dataFile, JSON.stringify(recipes, null, 2), (err) => {
	  	if (err) throw err;
	  	res.send({});
	  });
	})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});