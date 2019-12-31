const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const conf = require('../conf');
const User = require('../user/model');
const express = require('express')
const router = express.Router()

const strategy = new GoogleStrategy({
    clientID: '870268289655-9cjvpti3kas0e69aocdjevbp6133064f.apps.googleusercontent.com',
    clientSecret: 'OcACrKqTD76_YE1HMyq1hgYf',
    callbackURL: `http://${conf.appDomain}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      googleId: profile.id
    }).then(function(user) {
      return done(null, user);
    });
  }
);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
//router.get('/auth/google',
 // passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', 
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

module.exports = {
  strategy,
  router
}