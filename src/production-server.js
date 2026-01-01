// Load environment variables first
require('dotenv').config();

// Use MongoDB Atlas for deployment
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/test?retryWrites=true&w=majority';
  console.log('Using MongoDB Atlas for deployment');
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'super_strong_secret_key_change_me_123';
  console.log('Using hardcoded JWT secret for deployment');
}

const app = require('./app');
const connectDb = require('./db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Environment check:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'undefined');
    
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
