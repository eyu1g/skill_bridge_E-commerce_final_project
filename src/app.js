const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const healthRoutes = require('./routes/health');
const { notFound, errorHandler } = require('./middleware/errors');
const { baseResponse } = require('./utils/response');
const { authenticate, authorizeRoles } = require('./middleware/auth');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://skill-bridge-e-commerce-final-proje.vercel.app', 'https://skill-bridge-e-commerce-final-project.onrender.com'], // Allow local dev and specific deployed URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json(baseResponse({ Success: true, Message: 'SkillBridge E-commerce API', Object: null, Errors: null }));
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/health', healthRoutes);
// app.use('/api/orders', orderRoutes); // Temporarily disabled due to file system issues

// Temporary orders endpoints
app.post('/api/orders', authenticate, authorizeRoles('USER'), async (req, res) => {
  try {
    const Order = require('./models/Order');
    const Product = require('./models/Product');
    const { v4: uuidv4 } = require('uuid');
    
    const userId = req.user.userId;
    const items = req.body || [];

    // Get all products and calculate total
    const ids = items.map(i => i.productId);
    const products = await Product.find({ id: { $in: ids } }).lean();
    
    const productMap = new Map(products.map(p => [p.id, p]));
    const orderProducts = [];
    let totalPrice = 0;

    // Validate items and calculate total
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(404).json(baseResponse({ 
          Success: false, 
          Message: `Product not found: ${item.productId}`, 
          Object: null, 
          Errors: ['Product not found'] 
        }));
      }

      // Check stock availability
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json(baseResponse({ 
          Success: false, 
          Message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity || 1}`, 
          Object: null, 
          Errors: ['Insufficient stock'] 
        }));
      }

      orderProducts.push({
        productId: product.id,
        quantity: item.quantity || 1,
        unitPrice: product.price
      });

      totalPrice += product.price * (item.quantity || 1);
    }

    // Update stock for all products
    const updatePromises = items.map(item => {
      return Product.updateOne(
        { id: item.productId },
        { $inc: { stock: -(item.quantity || 1) } }
      );
    });

    await Promise.all(updatePromises);

    // Create the order in database
    const order = await Order.create({
      id: uuidv4(),
      userId,
      description: `Order with ${items.length} items`,
      totalPrice,
      status: 'pending',
      products: orderProducts
    });

    // Format response to match frontend expectations
    const formattedOrder = {
      order_id: order.id,
      status: order.status,
      total_price: order.totalPrice,
      created_at: order.createdAt,
      products: order.products
    };

    return res.status(201).json(baseResponse({ 
      Success: true, 
      Message: 'Order placed successfully', 
      Object: formattedOrder, 
      Errors: null 
    }));
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json(baseResponse({ 
      Success: false, 
      Message: 'Failed to place order', 
      Object: null, 
      Errors: ['Server error'] 
    }));
  }
});

app.get('/api/orders', authenticate, authorizeRoles('USER'), async (req, res) => {
  try {
    const Order = require('./models/Order');
    const userId = req.user.userId;
    
    const orders = await Order.find({ userId })
      .select('id status totalPrice createdAt products')
      .sort({ createdAt: -1 })
      .lean();

    // Format response to match frontend expectations
    const formattedOrders = orders.map(order => ({
      order_id: order.id,
      status: order.status,
      total_price: order.totalPrice,
      created_at: order.createdAt,
      products: order.products
    }));

    return res.status(200).json(baseResponse({ 
      Success: true, 
      Message: 'Orders fetched successfully', 
      Object: formattedOrders, 
      Errors: null 
    }));
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json(baseResponse({ 
      Success: false, 
      Message: 'Failed to fetch orders', 
      Object: null, 
      Errors: ['Server error'] 
    }));
  }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
