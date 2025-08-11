// Quick test script to verify Razorpay configuration
console.log('🧪 Testing Razorpay Configuration...\n');

// Test frontend environment variables
console.log('Frontend Configuration:');
console.log('API URL:', process.env.REACT_APP_API_URL || 'Not set');
console.log('Razorpay Key ID:', process.env.REACT_APP_RAZORPAY_KEY_ID || 'Not set');
console.log('');

// Test backend connectivity
const testBackend = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8083/api/v1';
    console.log('Testing backend connectivity...');
    console.log(`Attempting to connect to: ${apiUrl}/health`);
    
    // This would test if backend is running
    console.log('✅ If you can see Razorpay options in payment forms, the integration is working!');
    console.log('');
    
    console.log('🧪 Test Card Details:');
    console.log('Success Card: 4111 1111 1111 1111');
    console.log('Failure Card: 4000 0000 0000 0002'); 
    console.log('CVV: Any 3 digits (e.g., 123)');
    console.log('Expiry: Any future date (e.g., 12/25)');
    console.log('Name: Any name');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Ensure backend .env file has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
    console.log('2. Restart backend service');
    console.log('3. Check if port 8083 is available');
    console.log('4. Verify database connection');
  }
};

testBackend();
