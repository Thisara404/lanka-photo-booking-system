const mongoose = require('mongoose');

const printSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['landscapes', 'wildlife', 'portrait', 'cultural', 'coastal', 'other']
  },
  image: {
    type: String,
    required: true
  },
  printSizes: {
    type: [String],
    default: ['8*10', '11*14', '16*9']
  },
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  salesCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  highResDownloadUrl: {
    type: String,
    default: null
  },
  downloadTokens: [{
    token: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiresAt: Date,
    isUsed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Print', printSchema);