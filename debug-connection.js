const mongoose = require('mongoose');

// Add this to your app.js temporarily to debug
app.get('/debug/connection', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    const collections = await db.listCollections().toArray();
    const productCount = await db.collection('products').countDocuments();
    
    return res.json({
      databaseName: dbName,
      mongodb_uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'NOT_SET',
      collections: collections.map(c => c.name),
      productCount: productCount,
      fullUri: process.env.MONGODB_URI
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
