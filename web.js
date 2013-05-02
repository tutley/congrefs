/* Module Dependencies */

var express = require('express')
   , routes = require('./routes')
   , mongoose = require('mongoose')
   , mongo = require('mongodb')
   , janrain = require('janrain-api');

var MemoryStore = express.session.MemoryStore;

var app = module.exports = express();
global.app = app;

// Connect to the database once
var DB = require('./database');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/congrefs'; 
var db = new DB.startup(mongoUri);

app.locals.links = require('./navigation');

// App Config
app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(function(req, res, next) {
     var current = req.path.split('/');
     res.locals.current = '/' + current[1];
     next();
  });
   app.use(express.bodyParser());
   app.use(express.cookieParser());
   app.use(express.methodOverride());
   app.use(express.cookieSession({
      key: 'congrefs.sess',
      secret: 'wethepeople'
   }));
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
