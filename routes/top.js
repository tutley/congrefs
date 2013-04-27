var janrain = require('janrain-api');
var janKey = process.env.JANKEY;
var engageAPI = janrain(janKey);

var User = require('../models/user');

/**
 * function loggedIn(user) {
 * @param  {Object}  user [user object from current session]
 * @return {Boolean}      [true or false logged in status]
 */
function loggedIn(user) {
   if (user) {
      return true;
   } else {
      return false;
   }
}

module.exports = {

   // app.get('/'...)
   index: function(req, res) {
      res.render('index.jade', {
         title: 'Congrefs'
         , user: req.session.user
         , loggedIn: loggedIn(req.session.user)
         , tokenUrl : 'http://'+req.get('host')+'/rpx'
      });
   },

   // app.get('/login', top.login);
   login: function(req, res) {
      res.render('login.jade', {
         title: 'Congrefs Login'
         , tokenUrl : 'http://'+req.get('host')+'/rpx'
      });
   },

   // app.get('/loogout', top.logout);
   logout: function(req, res) {
      delete req.session;
      res.redirect('/');
   },

   // app.get('/new')
   newest: function(req, res, next) {
      res.render('template.jade', {
         title: 'Congrefs: Newest',
         user: req.session.user
      });   
   },
   
   // app.get('/top')
   top: function(req, res, next) {
      res.render('template.jade', {
         title: 'Congrefs: top',
         user: req.session.user
      });   
   },
   
   // app.get('/add')
   add: function(req, res, next) {
      res.render('template.jade', {
         title: 'Congrefs: Add',
         user: req.session.user
      });   
   },
   
   // app.get('/tos'...)
   tos: function(req, res) {
      res.render('tos.jade', {
         title: 'Congrefs Terms of Service'
      });
   },

   // app.get('/about', ...
   about: function(req, res) {
      res.render('about.jade', {
         title: 'About Congrefs'
      });
   },

   // app.get('/contact', ...
   contact: function(req, res) {
      res.render('contact.jade', {
         title: 'Contact Congrefs'
      });
   },

   // app.post('/rpx'
   rpx: function(req, res, next){
      // STEP1: Get the token sent by the widget and validate it. 
      var token = req.body.token;
      if(!token || token.length != 40 ) {
         res.send('Bad Token!');
         return;
      }
      // STEP2: get the auth info using the Janrain API.
      // Janrain will validate the request and return the profile
      // details using a secure channel.
      engageAPI.authInfo(token, true, function(err, data) {
         if(err) {
            // Probably need to add a better error page, give user opportunity to try again, etc
            res.send(err.message + ( data ? ('  --  ' + JSON.stringify(data)) : ''));
            return;
         }
         /** 
         *  Here we need to find out a few things:
         *  1) Is the user already in the system with that social provider? data.profile.identifier
         *  2) If so, populate req.session.user and redirect to '/'
         *  3) If not, grab user email or proceed to email entry page
         *  4) If email already exists:
         *     a) Display account Merge page (ask user if they want to add this social login to existing acct)
         *     b) Upon completion, populate req.session.user and redirect to '/'
         *  5) If email doesn't already exist, add new user
         *     a) grab email from email entry page or data profile
         *     b) display new account page
         *     c) display full zip code entry/lookup form and explain why
         */

         req.session.rpx = data.profile;
               
         User.findOne({ 'socialProfiles.identifier' : data.profile.identifier}, function(err, doc) {
            if (err) { next(err); }
            if (doc) {
               // User exists
               req.session.user = doc;
               res.redirect('/');
            } else {
               // user may not exist, need to check database
               // Check if email was already given
               if (data.profile.email){
                  // Search db for user based on email address
                  User.findOne({ 'email' : data.profile.email }, function(err, user) {
                     if (err) { next(err); }
                     if (user) {
                        // user exists, display account merge page
                        req.session.user = user;
                        res.redirect('/register/merge');
                     } else {
                        // user does not exist
                        res.redirect('/register/new');
                     }
                  });
               } else {
                  // display email entry page
                  res.redirect('/register/email');
               }
            }
         });
      });   
   }
};