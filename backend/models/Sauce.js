const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true, trim:true },
  name: { type: String, required: true , trim:true },
  manufacturer: { type: String, required: true, trim:true },
  description: { type: String, required: true, trim:true },
  mainPepper: { type: String, required: true, trim:true },
  imageUrl: { type: String, required: true, trim:true },
  heat: { type: Number, required: true, trim:true },
  likes: { type: Number, required: true, trim:true },
  dislikes : { type: Number, required: true, trim:true },
  usersLiked : {type: [String], required: true, trim:true },
  usersDisliked : {type: [String], required: true, trim:true },
});

module.exports = mongoose.model('Sauce', sauceSchema);