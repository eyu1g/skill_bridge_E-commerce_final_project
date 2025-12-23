const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const { baseResponse } = require('../utils/response');
const Product = require('../models/Product');

const router = express.Router();

// Create Product (Admin only)
router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  [
    body('name').isString().isLength({ min: 3, max: 100 }),
    body('description').isString().isLength({ min: 10 }),
    body('price').isFloat({ gt: 0 }),
    body('stock').isInt({ min: 0 }),
    body('category').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const { name, description, price, stock, category } = req.body;

    try {
      const id = uuidv4();
      const product = await Product.create({
        id,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category: category || null,
        userId: req.user.userId
      });
      return res.status(201).json(baseResponse({ Success: true, Message: 'Product created', Object: product, Errors: null }));
    } catch (err) {
      console.error(err);
      return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
    }
  }
);

// Update Product (Admin only)
router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  [
    param('id').isString(),
    body('name').optional().isString().isLength({ min: 3, max: 100 }),
    body('description').optional().isString().isLength({ min: 10 }),
    body('price').optional().isFloat({ gt: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('category').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    try {
      const exists = await Product.findOne({ id }).select('id -_id').lean();
      if (!exists) {
        return res.status(404).json(baseResponse({ Success: false, Message: 'Product not found', Object: null, Errors: ['Product not found'] }));
      }

      const fields = [];
      const values = [];
      if (name !== undefined) { fields.push('name = ?'); values.push(name); }
      if (description !== undefined) { fields.push('description = ?'); values.push(description); }
      if (price !== undefined) { fields.push('price = ?'); values.push(parseFloat(price)); }
      if (stock !== undefined) { fields.push('stock = ?'); values.push(parseInt(stock, 10)); }
      if (category !== undefined) { fields.push('category = ?'); values.push(category); }
      if (fields.length === 0) {
        const product = await Product.findOne({ id }).select('-_id').lean();
        return res.status(200).json(baseResponse({ Success: true, Message: 'Product updated', Object: product, Errors: null }));
      }

      const update = {};
      for (let i = 0; i < fields.length; i++) {
        const key = fields[i].split('=')[0].trim();
        update[key] = values[i];
      }

      const product = await Product.findOneAndUpdate({ id }, update, { new: true }).select('-_id').lean();

      return res.status(200).json(baseResponse({ Success: true, Message: 'Product updated', Object: product, Errors: null }));
    } catch (err) {
      console.error(err);
      return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
    }
  }
);

// List Products (public) with pagination and search
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1 }),
    query('search').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.limit || req.query.pageSize || '10', 10);
    const search = (req.query.search || '').trim();

    try {
      const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
      const totalProducts = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('id name price stock category -_id')
        .lean();

      const totalPages = Math.ceil(totalProducts / pageSize) || 1;
      return res.status(200).json({
        Success: true,
        Message: 'Products fetched',
        Object: products,
        PageNumber: page,
        PageSize: pageSize,
        TotalSize: totalProducts,
        Errors: null,
        currentPage: page,
        pageSize,
        totalPages,
        totalProducts,
        products
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
    }
  }
);

// Get Product by ID (public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ id }).select('-_id').lean();
    if (!product) {
      return res.status(404).json(baseResponse({ Success: false, Message: 'Product not found', Object: null, Errors: ['Product not found'] }));
    }
    return res.status(200).json(baseResponse({ Success: true, Message: 'Product fetched', Object: product, Errors: null }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
  }
});

// Delete Product (Admin only)
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;
  try {
    const exists = await Product.findOne({ id }).select('id -_id').lean();
    if (!exists) {
      return res.status(404).json(baseResponse({ Success: false, Message: 'Product not found', Object: null, Errors: ['Product not found'] }));
    }

    await Product.deleteOne({ id });
    return res.status(200).json(baseResponse({ Success: true, Message: 'Product deleted successfully', Object: null, Errors: null }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
  }
});

module.exports = router;
