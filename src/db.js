const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  console.log('Connecting to MongoDB...');
  console.log('MONGODB_URI:', uri);

  try {
    // Connect with updated options for MongoDB driver v4.0+
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // If it's a network error, suggest using local MongoDB
    if (error.message.includes('queryTxt') || error.message.includes('ETIMEOUT')) {
      console.log('\n💡 Suggestion: MongoDB Atlas connection failed.');
      console.log('To use local MongoDB instead:');
      console.log('1. Install MongoDB locally or use Docker: docker run -d -p 27017:27017 mongo');
      console.log('2. Update your .env file to use: MONGODB_URI=mongodb://localhost:27017/skillbridge_dev');
    }
    
    throw error;
  }
}

module.exports = { connectDb };
