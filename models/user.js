/*
User Schema

This defines the data stored for each user. It contains basic user
information, along with methods for passport authentication and
password storage.

This also includes the following references:

*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var passport = require("passport");
var bcrypt = require("bcrypt");

var UserSchema = new Schema({
   name: {
      first: {
         type: String,
         required: true
      },
      last: {
         type: String,
         required: true
      }
   },
   email: {
      type: String,
      unique: true
   },
   salt: {
      type: String,
      required: true
   },
   hash: {
      type: String,
      required: true
   }
}, {
   collection: "users"
});

UserSchema.virtual("password").get(function() {
   return this._password;
}).set(function(password) {
   var salt;
   this._password = password;
   salt = this.salt = bcrypt.genSaltSync(10);
   return this.hash = bcrypt.hashSync(password, salt);
});

UserSchema.method("verifyPassword", function(password, callback) {
   return bcrypt.compare(password, this.hash, callback);
});

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

module.exports = mongoose.model("User", UserSchema);