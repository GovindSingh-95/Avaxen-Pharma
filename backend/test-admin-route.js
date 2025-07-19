const axios = require('axios');

const testAdminRoute = async () => {
  try {
    console.log('🧪 Testing admin login route...');
    
    const response = await axios.post('https://avaxen-pharma.onrender.com/api/auth/admin/login', {
      email: 'Avaxanpharmaceuticals@gmail.com',
      password: 'brijesh@28_1974'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Route is accessible!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Route test failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data);
    console.log('URL:', error.config?.url);
  }
};

testAdminRoute();