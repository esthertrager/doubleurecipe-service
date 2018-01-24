const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const conf = require('../conf');
const User = require('../user/model');
const express = require('express')
const router = express.Router()

const strategy = new FacebookStrategy({
    clientID: '2151827951748121',
    clientSecret: 'a02aa76e046037f7f4414a021ea973ab',
    callbackURL: `http://${conf.appDomain}/auth/facebook/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      facebookId: profile.id
    }).then(function(user) {
      return done(null, user);
    });
  }
);

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    User.get({ facebookId: req.user.facebookId }).then((user) => {
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