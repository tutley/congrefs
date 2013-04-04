
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
   }

};