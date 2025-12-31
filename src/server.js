// Load environment variables first
require('dotenv').config();

const app = require('./app');
const { connectDb } = require('./db');

const PORT = parseInt(process.env.PORT || '3000', 10);

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
