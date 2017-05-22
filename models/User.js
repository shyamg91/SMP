var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: 'Please supply an email address',
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    lowercase: true
  },
  name: {
    type: String,
    required: 'Please type a name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  photo: String,
  projects : [String]
});

// userSchema.virtual('gravatar').get(function () {
//   const hash = md5(this.email);
//   return `https://gravatar.com/avatar/${hash}?s=200`;
// })

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);