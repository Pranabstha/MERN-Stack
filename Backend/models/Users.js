const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstname: {
    type: String,
    require
  },
  lastname: {
    type: String,
    require
  },
  image: {
    type: String
  }, 
  password: {
    type: String,
    require
  }, 
  email: {
    type: String,
    require
  }, 
  CreatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
});

const user = mongoose.model('user', UserSchema);

module.exports = user