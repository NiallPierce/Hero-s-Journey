const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateSteps,
  getInventory,
  useItem
} = require('../controllers/gameController');

// All routes are protected
router.use(protect);

// Step tracking
router.post('/steps', updateSteps);

// Inventory management
router.get('/inventory', getInventory);
router.post('/inventory/use/:itemId', useItem);

module.exports = router; 