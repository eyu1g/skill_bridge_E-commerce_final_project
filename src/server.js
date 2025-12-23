const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { connectDb } = require('./db');

const projectRoot = path.resolve(__dirname, '..');
const envPath = fs.existsSync(path.join(projectRoot, '.env'))
  ? path.join(projectRoot, '.env')
  : path.join(projectRoot, '.env.example');
dotenv.config({ path: envPath });

const PORT = parseInt(process.env.PORT || '3000', 10);

function listenOnPort(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      server.close(() => listenOnPort(port + 1));
      return;
    }
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

(async () => {
  try {
    await connectDb();
    listenOnPort(PORT);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
