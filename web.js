/* Module Dependencies */

var express = require('express')
   , routes = require('./routes')
   , mongoose = require('mongoose')
   , mongo = require('mongodb')
   , janrain = require('janrain-api')
   , passport = require('passport');

var app = module.exports = express();
global.app = app;

// Connect to the database once
var DB = require('./database');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/congrefs'; 
var db = new DB.startup(mongoUri);

// App Config
app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(express.bodyParser());
   app.use(express.cookieParser());
   app.use(express.methodOverride());
/* Need to find a new session storage method
   app.use(express.session({
      secret: 'inthecourseofhumanevents',
      maxAge: new Date(Date.now() + 3600000),
      store: new mongoStore({db : db})
   }));
*/
   app.use(app.router);
   app.use(express.static(__dirname + '/public'));
});

//environment specific config
app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
   app.use(express.errorHandler());
});

// Load the router
require('./routes')(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
