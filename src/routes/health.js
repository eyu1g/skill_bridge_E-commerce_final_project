const express = require('express');
const mongoose = require('mongoose');
const { baseResponse } = require('../utils/response');

const router = express.Router();

router.get('/database', async (req, res) => {
  try {
    // Check database connection
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database info
    const db = mongoose.connection.db;
    let collections = [];
    let productCount = 0;
    
    if (db) {
      collections = await db.listCollections().toArray();
      const products = await db.collection('products').countDocuments();
      productCount = products;
    }
    
    const healthInfo = {
      database: {
        state: states[state],
        connected: state === 1,
        collections: collections.length,
        productCount: productCount,
        collectionsList: collections.map(c => c.name)
      },
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET'
      }
    };
    
    return res.json(baseResponse({
      Success: true,
      Message: 'Health check completed',
      Object: healthInfo,
      Errors: null
    }));
    
  } catch (error) {
    return res.status(500).json(baseResponse({
      Success: false,
      Message: 'Health check failed',
      Object: null,
      Errors: [error.message]
    }));
  }
});

module.exports = router;
