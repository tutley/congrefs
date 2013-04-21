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
         /** 
         *  These first functions are a continuation of the account creation process:
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
        

   // app.get('/register/email')
   // req.session.rpx has social profile information
   emailEntry: function(req, res, next) {
      res.render('inputEmail.jade', {
         title: 'Email Address for Congrefs',
         user: req.session.rpx
      });
   },

   // app.post('/register/email', top.emailSearch);
   emailSearch: function(req, res, next) {
      req.session.email = req.body['email'];
      // Search db for user based on email address
      User.findOne({ 'email' : req.body['email'] }, function(err, user) {
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
   },

   // app.get('/register/merge')
   // req.session.rpx has new social profile information
   // req.session.user has current user profile
   merge: function(req, res, next) {
      res.render('mergeAccounts.jade', {
         title: 'Merge this Login to your Congrefs Account',
         user: req.session.user,
         newSocial: req.session.rpx
      });
   },
   
   // app.post('/register/merge', top.mergePost);   
   mergePost: function(req, res, next) {

   },

   // app.get('/register/new')
   // create a new account
   // req.session.rpx has social profile information
   newUser: function(req, res, next) {
      var input = req.session.rpx;
      var user = new User({
         displayName: input.displayName,
         email: req.session.email
      });
      user.socialProfiles.push(input);

      user.save(function(err, data) {
         if (err) { next(err); }
         req.session.user = data;
         res.render('newAccount.jade', {
            title: 'Welcome to Congrefs' ,
            user: data
         });
      });
   }

   /**
    * These functions are for account management
    */

};