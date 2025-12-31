// Load environment variables first
require('dotenv').config();

// Temporary fix for deployment
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://SheRise-MVP:Sherise123@cluster0.tsckxqi.mongodb.net/test?retryWrites=true&w=majority';
  console.log('Using hardcoded MongoDB URI for deployment');
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'super_strong_secret_key_change_me_123';
  console.log('Using hardcoded JWT secret for deployment');
}

const app = require('./app');
const { connectDb } = require('./db');

const PORT = parseInt(process.env.PORT || '3000', 10);

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'undefined');

function listenOnPort(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      server.close(() => listenOnPort(port + 1));
      return;
    }
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI); // check if loaded
    await connectDb();
    console.log('MongoDB connected successfully!');
    listenOnPort(PORT);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
