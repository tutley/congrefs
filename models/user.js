/**
 * User Schema
 * 
 * This defines the data stored for each user. It contains basic user
 * information, along with methods for passport authentication and
 * password storage.
 * 
 * This also includes the following references:
 * 
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
   displayName: String,
   socialProfiles: [{
      providerName: String,
      identifier: String,
      preferredUsername: String,
      verifiedEmail: String,
      email: String,
      displayName: String,
      name: { 
         formatted: String,
         givenName: String,
         familyName: String 
      },
      url: String,
      photo: String,
      utcOffset: String,
      address: { 
         formatted: String 
      },
      googleUserId: String,
      gender: String,
      birthday: String,
      phone: String
   }],
   state: String,
   district: String,
   email: {
      type: String,
      unique: true
   }
}, {
   collection: "users"
});


/*
UserSchema.static("authenticate", function(email, password, callback) {
   return this.findOne({ email: email }, function(err, user) {
      if (err) {
         return callback(err);
      }
      if (!user) {
         return callback(null, false, {
            message: "Sorry, no user found with email: " + email
         });
      }
      return user.verifyPassword(password, function(err, passwordCorrect) {
         if (err) {
            return callback(err);
         }
         if (!passwordCorrect) {
            return callback(null, false, {
               message: "Password Incorrect, try again."
            });
         }
         return callback(null, user);
      });
   });
});
*/

module.exports = mongoose.model("User", UserSchema);
