const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  src: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  caption: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Photo', PhotoSchema);