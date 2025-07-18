const express = require('express');
const {
  getDeliveryAgents,
  getAvailableAgents,
  assignAgentToOrder,
  autoAssignAgent,
  createDeliveryAgent,
  updateAgentLocation,
  completeDelivery
} = require('../controllers/deliveryAgentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes (for admin/pharmacy staff)
router.get('/agents', protect, getDeliveryAgents);
router.get('/agents/available', protect, getAvailableAgents);
router.post('/agents', protect, createDeliveryAgent);
router.post('/assign', protect, assignAgentToOrder);
router.post('/auto-assign', protect, autoAssignAgent);
router.put('/agents/:agentId/location', protect, updateAgentLocation);
router.post('/complete', protect, completeDelivery);

module.exports = router;
