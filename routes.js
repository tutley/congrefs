
// If I use Passport
//var passport = require('passport');

/*
* Include Routing Subfiles
*/
var top = require('./routes/top');
var bill = require('./routes/bill');
var user = require('./routes/user');
var admin = require('./routes/admin');

/* This function checks to see if the user is logged in, 
*  and can be used in any route that requires auth
*/
function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) { return next(); }
   res.redirect('/login');
}

module.exports =  function(app){

   /**
    * Top Routes - Home page, about, contact, etc
    */

   app.get('/',   top.index);


};