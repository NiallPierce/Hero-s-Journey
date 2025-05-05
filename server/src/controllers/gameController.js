const User = require('../models/User');
const Item = require('../models/Item');
const Achievement = require('../models/Achievement');

// Update user's steps
exports.updateSteps = async (req, res) => {
  try {
    const { steps } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update steps
    user.steps.total += steps;
    user.steps.daily += steps;
    user.steps.lastUpdated = new Date();

    // Calculate experience and level
    const experienceGained = Math.floor(steps * 0.1); // 0.1 exp per step
    user.character.experience += experienceGained;

    // Check for level up
    const newLevel = Math.floor(user.character.experience / 1000) + 1;
    if (newLevel > user.character.level) {
      user.character.level = newLevel;
      // Level up rewards
      user.character.stats.maxHealth += 10;
      user.character.stats.health = user.character.stats.maxHealth;
      user.character.stats.attack += 2;
      user.character.stats.defense += 1;
    }

    // Check achievements
    const achievements = await Achievement.find({
      'requirements.type': 'steps',
      'requirements.value': { $lte: user.steps.total }
    });

    for (const achievement of achievements) {
      if (!user.achievements.some(a => a.id === achievement._id.toString())) {
        user.achievements.push({
          id: achievement._id,
          unlockedAt: new Date()
        });

        // Apply achievement rewards
        user.character.experience += achievement.rewards.experience;
        user.steps.total += achievement.rewards.steps;

        // Add items to inventory
        for (const itemReward of achievement.rewards.items) {
          const existingItem = user.inventory.find(
            item => item.itemId.toString() === itemReward.itemId.toString()
          );

          if (existingItem) {
            existingItem.quantity += itemReward.quantity;
          } else {
            user.inventory.push({
              itemId: itemReward.itemId,
              quantity: itemReward.quantity
            });
          }
        }
      }
    }

    await user.save();

    res.json({
      steps: user.steps,
      character: user.character,
      achievements: user.achievements
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's inventory
exports.getInventory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('inventory.itemId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Use an item
exports.useItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id)
      .populate('inventory.itemId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const inventoryItem = user.inventory.find(
      item => item.itemId._id.toString() === itemId
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    const item = inventoryItem.itemId;

    // Apply item effects
    for (const effect of item.effects) {
      switch (effect.type) {
        case 'heal':
          user.character.stats.health = Math.min(
            user.character.stats.maxHealth,
            user.character.stats.health + effect.value
          );
          break;
        case 'buff':
          // Apply temporary buff (implement buff system)
          break;
        // Add more effect types as needed
      }
    }

    // Remove item from inventory
    if (inventoryItem.quantity > 1) {
      inventoryItem.quantity--;
    } else {
      user.inventory = user.inventory.filter(
        item => item.itemId._id.toString() !== itemId
      );
    }

    await user.save();

    res.json({
      message: 'Item used successfully',
      character: user.character,
      inventory: user.inventory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 