const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['steps', 'combat', 'collection', 'social', 'special'],
    required: true
  },
  requirements: {
    type: {
      type: String,
      enum: ['steps', 'kills', 'items', 'friends', 'level'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  rewards: {
    experience: {
      type: Number,
      default: 0
    },
    steps: {
      type: Number,
      default: 0
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }]
  },
  icon: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Achievement', achievementSchema); 