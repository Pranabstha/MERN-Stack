const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  throwitle: {
    type: String,
    require
  },
  category: {
    type: String,
    require
  },
  image: {
    type: String
  }, 
  userId: {
    type: String,
    require
  }, 
  CreatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const user = mongoose.model('user', UserSchema);

module.exports = user