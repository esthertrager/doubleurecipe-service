var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '870268289655-9cjvpti3kas0e69aocdjevbp6133064f.apps.googleusercontent.com',
    clientSecret: 'OcACrKqTD76_YE1HMyq1hgYf',
    callbackURL: "http://localhost/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
		// User.findOrCreate({ googleId: profile.id }, function (err, user) {
		//   return done(err, user);
		// });
		console.log('Authenticated', accessToken, refreshToken, profile);
		done();
  }
));