const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String, 
    required: true,
    unique: true,
    validate: [isEmail],
    lowercase: true,
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    trim: true,
    minLength: 6,
    max: 250
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);