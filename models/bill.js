/**
 * Bill Schema
 * 
 * This defines the data stored for each bill in the system
 * This includes votes, comments, link to the bill on external website, etc
 * Oh and of course the bill info
 * 
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BillSchema = new Schema({
   bill_id: String,
   title: String,
   summary: String,
   uri: String,
   tags: [{'tag': String}],
   comments: [{
      user: { 
         type: ObjectId,
         ref: 'User'
      },
      comment: String,
      createdAt: { type : Date, default : Date.now }   
   }],
   votes: [{
      user: {
         type: ObjectId,
         ref: 'User'
      },
      vote: String
   }]
}, {
   collection: "bills"
});

module.exports = mongoose.model("Bill", BillSchema);
