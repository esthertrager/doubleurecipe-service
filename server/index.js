const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const recipesModel = require('./recipes/model');
const mongooseConnect = require('./mongooseConnect');

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const handleError = (error) => {
	res.status(error.status).send(error.text)
};

app.get('/', function (req, res) {
  res.send({
  	timestamp: Date.now()
  });
});

app.get('/recipes', function (req, res) {
	recipesModel.get().then((recipes) => {
		res.send(recipes);
	}, handleError);
});

app.get('/recipes/:id', function (req, res) {
	recipesModel.findById(req.params.id).then((recipe) => {
		res.send(recipe);
	}, handleError);
});

app.post('/recipes', function (req, res) {
	const recipe = req.body;
	recipesModel.create(recipe).then((_recipe) => {
		res.send(_recipe);
	}, handleError);
});

app.put('/recipes/:id', function (req, res) {
	const recipe = req.body;
	recipesModel.update(recipe).then((_recipe) => {
		res.send(_recipe);
	}, handleError);
});

app.delete('/recipes/:id', function (req, res) {
	recipesModel.remove(req.params.id).then(() => {
		res.send({});
	}, handleError);
});

mongooseConnect().then(() => {
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});
})