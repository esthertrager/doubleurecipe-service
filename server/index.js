const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');
const recipeModel = require('./recipe/model');
const User = require('./user/model');
const mongooseConnect = require('./mongooseConnect');
const passport = require('passport');
const cookieSession = require('cookie-session');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

app.use(cookieSession({
  name: 'session',
  keys: ['keyboard cat'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
passport.use(new GoogleStrategy({
    clientID: '870268289655-9cjvpti3kas0e69aocdjevbp6133064f.apps.googleusercontent.com',
    clientSecret: 'OcACrKqTD76_YE1HMyq1hgYf',
    callbackURL: "http://127.0.0.1/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

		User.findOrCreate({ googleId: profile.id }).then(function (user) {
		  return done(null, user);
		});

  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const handleError = (res) => (error) => {
	res.status(error.status).send(error.text)
};

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

app.post('/recipes', function (req, res) {
	const recipe = req.body;
	recipeModel.create(recipe).then((_recipe) => {
		res.send(_recipe);
	}, handleError(res));
});

app.get('/user', function (req, res) {
  console.log(req.user, req.session);
  User.get({_id: req.user._id}).then((user) => {
    res.send(user);
  }, handleError(res));
});

app.put('/users/:id', function (req, res) {
  const user = req.body;
  User.update(user).then((_user) => {
    res.send(_user);
  }, handleError(res));
});

app.post('/users', function (req, res) {
	const user = req.body;
	console.log(req.user, req.session);
	userModel.create(user).then((_user) => {
		res.send(_user);
	}, handleError(res));
});

app.put('/recipes/:id', function (req, res) {
	const recipe = req.body;
	recipeModel.update(recipe).then((_recipe) => {
		res.send(_recipe);
	}, handleError(res));
});

app.delete('/recipes/:id', function (req, res) {
	recipeModel.remove(req.params.id).then(() => {
		res.send({});
	}, handleError(res));
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', {
  	failureRedirect: '/'
  }),
  function(req, res) {
  	User.get({ googleId: req.user.googleId }).then((user) => {
  		if (user && user.name) {
		    res.redirect(`/recipes`);
  		} else {
  			res.redirect('/profile')
  		}
  	}, (error) => {
      console.log('Auth callback failed', error);
    });
  });

mongooseConnect().then(() => {
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});
})