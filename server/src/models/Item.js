const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['weapon', 'armor', 'consumable', 'quest', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  stats: {
    health: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    energy: { type: Number, default: 0 }
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  levelRequirement: {
    type: Number,
    default: 1
  },
  classRestriction: {
    type: String,
    enum: ['warrior', 'mage', 'rogue', 'healer', 'all'],
    default: 'all'
  },
  effects: [{
    type: {
      type: String,
      enum: ['buff', 'debuff', 'heal', 'damage'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 0 // 0 means instant
    }
  }]
});

module.exports = mongoose.model('Item', itemSchema); 