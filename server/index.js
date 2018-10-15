const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const recipeModel = require('./recipe/model');
const User = require('./user/model');
const mongooseConnect = require('./mongooseConnect');
const passport = require('passport');
const cookieSession = require('cookie-session');
const conf = require('./conf');
const Google = require('./auth/Google');
const Facebook = require('./auth/Facebook');

app.use(cookieSession({
  name: 'session',
  keys: ['keyboard cat'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
console.log('conf', conf);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

passport.use(Google.strategy);
passport.use(Facebook.strategy);
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

const handleError = (res) => (error) => {
  console.error(error);
	res.status(error.status).send(error.text)
};

app.use(Google.router);
app.use(Facebook.router);

app.get('/', function (req, res) {
  res.send({
  	timestamp: Date.now()
  });
});

app.get('/recipes', function (req, res) {
	console.log(req.user, req.session);
	recipeModel.get().then((recipes) => {
		res.send(recipes);
	}, handleError(res));
});

app.get('/recipes/:id', function (req, res) {
  recipeModel.findById(req.params.id).then((recipe) => {
    res.send(recipe);
  }, handleError(res));
});

app.post('/recipes', userIsAuthenticated, function (req, res) {
  const recipe = req.body;
  recipe.owner = req.user._id;
  recipeModel.create(recipe).then((_recipe) => {
    res.send(_recipe);
  }, handleError(res));
});

app.put('/recipes/:id', userIsAuthenticated, userOwnsRecipe, function (req, res) {
	const recipe = req.body;
	recipeModel.update(recipe).then((_recipe) => {
		res.send(_recipe);
	}, handleError(res));
});

function userIsAuthenticated(req, res, next) {
  const user = req.user;
  if (!user) {
      return res.status(401).send('User is not signed in.');
  } else {
    next();
  }
}

function userOwnsRecipe(req, res, next) {
  const user = req.user;
  recipeModel.findById(req.params.id).then((recipe) => {
    if (recipe.owner._id.toString() === user._id.toString()) {
      next();
    } else {
      res.status(403).send('User does not have permission to this recipe.');
    }
  });
}

function userOwnsUser(req, res, next) {
  const user = req.user;

  User.get({ _id: req.params.id }).then((_user) => {
    if (_user._id.toString() == user._id.toString()) {
      next();
    } else {
      res.status(403).send('User does not have permission to this user.');
    }
  });
}

app.delete('/recipes/:id', userIsAuthenticated, userOwnsRecipe, function (req, res) {
	recipeModel.remove(req.params.id).then(() => {
		res.send({});
	}, handleError(res));
});

app.get('/users/current', function (req, res) {
  console.log(req.user);
  if (!req.user) {
    res.status(204).send();
  } else {
    User.get({_id: req.user._id}).then((user) => {
      res.send(user);
    }, handleError(res));
  }
});

app.put('/users/:id', userIsAuthenticated, userOwnsUser, function (req, res) {
  const user = req.body;
  User.update(user).then((_user) => {
    res.send(_user);
  }, handleError(res));
});

app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

mongooseConnect().then(() => {
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});
})