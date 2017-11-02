const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/recipes', function (req, res) {
	fs.readFile('recipes.json', (err, data) => {
	  if (err) throw err;
	  res.send(JSON.parse(data));
	});
});

app.get('/recipes/:id', function (req, res) {
	fs.readFile('recipes.json', (err, data) => {
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
	fs.readFile('recipes.json', (err, data) => {
	  if (err) throw err;
	  const recipes = JSON.parse(data);
	  const id = recipes.length;
	  recipe.id = id;
	  recipes.push(recipe);
	  fs.writeFile('recipes.json', JSON.stringify(recipes, null, 2), (err) => {
	  	if (err) throw err;
	  	res.send(recipe);
	  });
	})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});