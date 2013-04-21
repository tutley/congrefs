/**
* Include Routing Subfiles
*/
var top = require('./routes/top');
var bill = require('./routes/bill');
var user = require('./routes/user');
var admin = require('./routes/admin');

/** 
*  This function checks to see if the user is logged in, 
*  and can be used in any route that requires auth
*/
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

module.exports =  function(app){

   /**
    * Top Routes - Home page, about, contact, etc
    */
   app.get('/',   top.index);
   app.get('/login', top.login);
   app.get('/logout', top.logout);

   // Janrain Login Post
   app.post('/rpx', top.rpx);


   /**
    * User Routes - New accounts, merging accounts, account management
    */
   app.get('/register/email', user.emailEntry);
   app.post('/register/email', user.emailSearch);
   app.get('/register/merge', user.merge);
   app.post('/register/merge', user.mergePost);   
   app.get('/register/new', user.newUser);

};