const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { baseResponse } = require('../utils/response');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// Place a new order (User only)
router.post(
  '/',
  authenticate,
  authorizeRoles('USER'),
  [
    body().isArray({ min: 1 }).withMessage('Body must be an array of items'),
    body('*.productId').isString().withMessage('productId is required'),
    body('*.quantity').isInt({ min: 1 }).withMessage('quantity must be >= 1')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const userId = req.user.userId;
    const items = req.body;

    let session;
    try {
      session = await mongoose.startSession();
      let createdOrder;

      await session.withTransaction(async () => {
        const ids = items.map(i => i.productId);
        const products = await Product.find({ id: { $in: ids } })
          .select('id name price stock -_id')
          .session(session)
          .lean();
        const map = new Map(products.map(p => [p.id, p]));

        for (const it of items) {
          const p = map.get(it.productId);
          if (!p) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
          }
        }

        let totalPrice = 0;
        const orderProducts = items.map(it => {
          const p = map.get(it.productId);
          totalPrice += p.price * it.quantity;
          return { productId: p.id, quantity: it.quantity, unitPrice: p.price };
        });

        // Decrement stock atomically
        for (const it of items) {
          const upd = await Product.updateOne(
            { id: it.productId, stock: { $gte: it.quantity } },
            { $inc: { stock: -it.quantity } },
            { session }
          );
          if (upd.matchedCount === 0) {
            const p = map.get(it.productId);
            const err = new Error(`Insufficient stock for product ${p ? p.name : it.productId}`);
            err.status = 400;
            throw err;
          }
        }

        const orderId = uuidv4();
        const created = await Order.create(
          [
            {
              id: orderId,
              userId,
              totalPrice,
              status: 'pending',
              products: orderProducts
            }
          ],
          { session }
        );
        createdOrder = created[0].toObject();
      });

      await session.endSession();

      const responseOrder = {
        order_id: createdOrder.id,
        status: createdOrder.status,
        total_price: createdOrder.totalPrice,
        created_at: createdOrder.createdAt,
        products: createdOrder.products
      };

      return res.status(201).json(baseResponse({ Success: true, Message: 'Order created', Object: responseOrder, Errors: null }));
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      return res.status(status).json(baseResponse({ Success: false, Message: err.message || 'Server error', Object: null, Errors: null }));
    } finally {
      if (session) {
        try { await session.endSession(); } catch (_) {}
      }
    }
  }
);

// Get my orders (authenticated)
router.get('/', authenticate, authorizeRoles('USER', 'ADMIN'), async (req, res) => {
  const userId = req.user.userId;
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select('id status totalPrice createdAt -_id')
      .lean();
    const mapped = orders.map(o => ({
      order_id: o.id,
      status: o.status,
      total_price: o.totalPrice,
      created_at: o.createdAt
    }));
    return res.status(200).json(baseResponse({ Success: true, Message: 'Orders fetched', Object: mapped, Errors: null }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
  }
});

module.exports = router;
