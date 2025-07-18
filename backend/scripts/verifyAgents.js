const mongoose = require('mongoose');
const DeliveryAgent = require('../models/DeliveryAgent');
require('dotenv').config();

const verifyAgents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const agents = await DeliveryAgent.find();
    console.log('📋 Total Delivery Agents:', agents.length);
    
    agents.forEach((agent, i) => {
      console.log(`${i+1}. ${agent.name} - ${agent.phone} (${agent.status})`);
      console.log(`   Vehicle: ${agent.vehicle.type} - ${agent.vehicle.number}`);
      console.log(`   Location: ${agent.location.address}`);
      console.log(`   Rating: ${agent.rating}/5 (${agent.totalDeliveries} deliveries)`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyAgents();
