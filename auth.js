
// Authentication Definition File

// dependencies for authentication
var passport = require('passport')
   , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

// Define local strategy for Passport
passport.use(new LocalStrategy({
      usernameField: 'email'
   },
   function(email, password, done) {
      User.authenticate(email, password, function(err, user, message) {
         return done(err, user, message);
      });
   }
));

// serialize user on login
passport.serializeUser(function(user, done) {
   done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
   User.findById(id, function (err, user) {
      done(err, user);
   });
});
