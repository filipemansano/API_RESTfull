var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    fullname: String,
    email: String,
    year: Number,
});

module.exports = mongoose.model('User', UserSchema);