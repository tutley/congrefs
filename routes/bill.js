
module.exports = {

   // app.get('/bill/:bid'...)
   view: function(req, res) {
      res.render('template.jade', {
         title: 'Congrefs: View Bill'
      });   
   }

};