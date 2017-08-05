var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require('../config');

var UserSchema = new Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User,
  UserSchema: UserSchema
};
