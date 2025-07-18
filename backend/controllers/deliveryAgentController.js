const DeliveryAgent = require('../models/DeliveryAgent');
const Order = require('../models/Order');

// Get all delivery agents
const getDeliveryAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find({ isActive: true });
    res.json({
      success: true,
      agents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery agents',
      error: error.message
    });
  }
};

// Get available delivery agents
const getAvailableAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find({ 
      status: 'available', 
      isActive: true 
    });
    res.json({
      success: true,
      agents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available agents',
      error: error.message
    });
  }
};

// Assign delivery agent to order
const assignAgentToOrder = async (req, res) => {
  try {
    const { orderId, agentId } = req.body;

    // Find the order and agent
    const order = await Order.findById(orderId);
    const agent = await DeliveryAgent.findById(agentId);

    if (!order || !agent) {
      return res.status(404).json({
        success: false,
        message: 'Order or Agent not found'
      });
    }

    if (agent.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Agent is not available'
      });
    }

    // Update order with agent details
    order.deliveryAgent = {
      id: agent._id,
      name: agent.name,
      phone: agent.phone,
      vehicle: agent.vehicle
    };
    order.status = 'assigned';
    await order.save();

    // Update agent status
    agent.status = 'busy';
    agent.currentOrders.push(orderId);
    await agent.save();

    res.json({
      success: true,
      message: 'Agent assigned successfully',
      order,
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        vehicle: agent.vehicle
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign agent',
      error: error.message
    });
  }
};

// Auto-assign nearest available agent
const autoAssignAgent = async (req, res) => {
  try {
    const { orderId, customerLocation } = req.body;

    // Find available agents
    const availableAgents = await DeliveryAgent.find({ 
      status: 'available', 
      isActive: true 
    });

    if (availableAgents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No agents available'
      });
    }

    // Simple assignment logic - just pick the first available agent
    // In production, you might want to implement distance-based assignment
    const selectedAgent = availableAgents[0];

    // Assign the agent
    const assignResult = await assignAgentToOrder({
      body: { orderId, agentId: selectedAgent._id }
    }, res);

    return assignResult;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to auto-assign agent',
      error: error.message
    });
  }
};

// Create new delivery agent
const createDeliveryAgent = async (req, res) => {
  try {
    const agentData = req.body;
    const agent = new DeliveryAgent(agentData);
    await agent.save();

    res.status(201).json({
      success: true,
      message: 'Delivery agent created successfully',
      agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create delivery agent',
      error: error.message
    });
  }
};

// Update agent location
const updateAgentLocation = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { latitude, longitude, address } = req.body;

    const agent = await DeliveryAgent.findByIdAndUpdate(
      agentId,
      {
        location: { latitude, longitude, address }
      },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
};

// Complete delivery
const completeDelivery = async (req, res) => {
  try {
    const { orderId, agentId } = req.body;

    // Update order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'delivered' },
      { new: true }
    );

    // Update agent status
    const agent = await DeliveryAgent.findById(agentId);
    agent.status = 'available';
    agent.currentOrders.pull(orderId);
    agent.totalDeliveries += 1;
    await agent.save();

    res.json({
      success: true,
      message: 'Delivery completed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete delivery',
      error: error.message
    });
  }
};

module.exports = {
  getDeliveryAgents,
  getAvailableAgents,
  assignAgentToOrder,
  autoAssignAgent,
  createDeliveryAgent,
  updateAgentLocation,
  completeDelivery
};
