var Bill = require('../models/bill');
var sunKey = process.env.SUNKEY;
var http = require('http');

/**
 * function pagination(count, perPage) {
 * @param  {number} count   total number of records
 * @param  {number} perPage records per page
 * @return {array}  pages   array containing page numbers and state info
 */
function pagination(count, perPage, current) {
   var pages = [];

   var totalPages = Math.round(count / perPage);   

   // calculate a big navigation jump
   var scale = Math.floor(Math.log(totalPages)/Math.LN10);
   var bigJump = 10 ^ scale;

   // This logic is probably not the best, but it's a first shot
   // at creating logical pagination links
   if (current < 8) {
      // Show links for 1 through 7 then ... then last
      for (var i = 1; i < 9 && i < totalPages; i++) {
         var klass = '';
         if (i==current) { klass='active'; }
         pages.push({ 'number' : i , 'class' : klass });
      }
      if (totalPages > 8) {
         pages.push({ 'number' : '...', 'class' : 'disabled' });
         pages.push({'number' : totalPages , 'class' : ''});
      }
   } else if (current > (totalPages-7)) {
      // Show link for 1 then ... then total-7 to total
      pages.push({ 'number' : 1, 'class' : ''});
      if (totalPages != 8) {
         pages.push({ 'number' : '...', 'class' : 'disabled' });
      }
      for (var i = totalPages - 7; i <= totalPages; i++) {
         var klass = '';
         if (i==current) { klass='active'; }
         pages.push({ 'number' : i , 'class' : klass });
      }
   } else {
      // show link for 1 then ... then current-3 through current + 3 then ... then total
      pages.push({ 'number' : 1, 'class' : ''});
      pages.push({ 'number' : '...', 'class' : 'disabled' });
      var lower = current -4;
      for (var i = 0; i < 9; i++) {
         var klass = '';
         if (( lower+i ) == current) { klass='active'; }
         pages.push({ 'number' : (lower+i) , 'class' : klass });
      }
      pages.push({ 'number' : '...', 'class' : 'disabled' });
      pages.push({ 'number' : totalPages, 'class' : ''});
   }

   return pages;
}

module.exports = {

   // app.get('/bill/:bid'...)
   view: function(req, res) {
      res.render('template.jade', {
         title: 'Congrefs: View Bill'
      });   
   },

   // app.get('/add')
   add: function(req, res, next) {
      var uri = 'http://congress.api.sunlightfoundation.com/'
         + 'bills?apikey='
         + sunKey
         + '&fields=bill_id,bill_type,number,introduced_on,last_vote_at,last_action_at,official_title,'
         + 'short_title,nicknames,keywords,urls,history,sponsor,enacted_as';
      // fetch the list of bills from the sunlight API
      http.get(uri, function(apiRes) {
         var message = '';
         apiRes.on('error', function(e) {
            res.render('bill/addError.jade', {
               title: 'Congrefs: Error getting Bills',
               user: req.session.user,
               error: e
            });
         });
         apiRes.on('data', function(chunk) {
            message+=chunk;
         });
         apiRes.on('end', function() {
            var obj = JSON.parse(message);
            // Here we figure out pagination and pass an object to the view
            var pages = pagination(obj.count, obj.page.per_page, 1);

            // TODO: compare the result object with the bills already in the system,
            // only send bills that aren't already in the system
            res.render('bill/add.jade', {
               title: 'Congrefs: Add',
               user: req.session.user,
               bills: obj,
               pages: pages,
               sort: '',
               query: ''
            });   
         });
      });
   },

   // app.get('/add/p/:page/:sort')
   addPagination: function(req, res, next) {
      var page = req.params.page;
      var sort = req.params.sort || '';
      var query = req.query['searchString'] || '';
      var uri = 'http://congress.api.sunlightfoundation.com/bills';
      if (query !== ''){
         uri += '/search?query="' + query + '"&';
      } else {
         uri += '?';
      }
      uri += 'apikey=' + sunKey
         + '&page=' + page
         + '&fields=bill_id,bill_type,number,introduced_on,last_vote_at,last_action_at,official_title,'
         + 'short_title,nicknames,keywords,urls,history,sponsor,enacted_as';

      if (sort) {
         uri += '&order=' + sort;
      }

      console.log(uri);
      // fetch the list of bills from the sunlight API
      http.get(uri, function(apiRes) {
         var message = '';
         apiRes.on('error', function(e) {
            res.render('bill/addError.jade', {
               title: 'Congrefs: Error getting Bills',
               user: req.session.user,
               error: e
            });
         });
         apiRes.on('data', function(chunk) {
            message+=chunk;
         });
         apiRes.on('end', function() {
            var obj = JSON.parse(message);
            //entire response
            //console.log(obj);
            // Here we figure out pagination and pass an object to the view
            var pages = pagination(obj.count, obj.page.per_page, page);

            // TODO: compare the result object with the bills already in the system,
            // only send bills that aren't already in the system
            res.render('bill/add.jade', {
               title: 'Congrefs: Add',
               user: req.session.user,
               bills: obj,
               pages: pages,
               sort: sort,
               query: query
            });   
         });
      });
   }

};