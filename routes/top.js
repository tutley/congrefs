var janrain = require('janrain-api');
var janKey = process.env.JANKEY;
var engageAPI = janrain(janKey);

module.exports = {

   // app.get('/'...)
   index: function(req, res) {
      res.render('index.jade', {
         title: 'Congrefs'
         , currentUser: req.user
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
   rpx: function(req, res){
     // STEP1: Get the token sent by the widget and validate it. 
     var token = req.body.token;
     if(!token || token.length != 40 ) {
       res.send('Bad Token!');
       return;
     }
     console.log('Auth Token');
     console.log(token);
    
     // STEP2: get the auth info using the Janrain API.
     // Janrain will validate the request and return the profile
     // details using a secure channel.
     engageAPI.authInfo(token, true, function(err, data) {
       if(err) {
         res.send(err.message + ( data ? ('  --  ' + JSON.stringify(data)) : ''));
         return;
       }

      console.log('auth data');
      console.log(data);
       /* check if we assigned a unique identifier to this user and
          if so they user is a return user if not we need to create
          a account in our user management system. You can also make
          other API calls to get the user contact list, friends, etc.

       if(data.profile.primaryKey) {
         signInUser(data.profile.primaryKey);
       } else {
         var uid = create a new user in your management system.
         engageAPI.map(data.profile.identifier, uid, function(err, data) {
           if(err) {res.send(err.message); return;}
           signInUser(uid);
         });
       }
       */

       res.send(JSON.stringify(data));
     });   
  }

};