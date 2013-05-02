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
   app.get('/new', top.newest);
   app.get('/top', top.top);
   app.get('/about', top.about);
   app.get('/tos', top.tos);
   app.get('/contact', top.contact);

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
   app.get('/register/district', user.district);

   app.get('/account/view', restrict, user.viewAccount);
   app.post('/account/edit', restrict, user.editAccount);
   app.get('/account/votes', restrict, user.viewMyVotes);
   app.get('/account/comments', restrict, user.viewMyComments);

   app.get('/u/:uid', user.viewProfile);
   app.get('/u/:uid/votes', user.viewVotes);
   app.get('/u/:uid/comments', user.viewComments);

   /**
    * Bill Routes - Add bills, vote, leave comments, show bill information
    * 
    */
   app.get('/add', bill.add);
   app.get('/add/p/:page/:sort?', bill.addPagination);




};