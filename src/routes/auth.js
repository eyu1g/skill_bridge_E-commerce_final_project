const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { baseResponse } = require('../utils/response');
const User = require('../models/User');

const router = express.Router();

const usernameRegex = /^[A-Za-z0-9]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

router.post(
  '/register',
  [
    body('username').isString().isLength({ min: 1 }).matches(usernameRegex).withMessage('Username must be alphanumeric and non-empty'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').matches(passwordRegex).withMessage('Password too weak')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const { username, email, password, role } = req.body;

    try {
      const emailRow = await User.findOne({ email }).select('id -_id').lean();
      if (emailRow) {
        return res.status(400).json(baseResponse({ Success: false, Message: 'Email already registered', Object: null, Errors: ['Email exists'] }));
      }
      const userRow = await User.findOne({ username }).select('id -_id').lean();
      if (userRow) {
        return res.status(400).json(baseResponse({ Success: false, Message: 'Username already taken', Object: null, Errors: ['Username exists'] }));
      }

      const hashed = await bcrypt.hash(password, 10);
      const id = uuidv4();
      const finalRole = role === 'ADMIN' ? 'ADMIN' : 'USER';
      await User.create({ id, username, email, password: hashed, role: finalRole });
      const created = await User.findOne({ id }).select('id username email role createdAt -_id').lean();

      return res.status(201).json(baseResponse({ Success: true, Message: 'User registered successfully', Object: created, Errors: null }));
    } catch (err) {
      console.error(err);
      return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isString().isLength({ min: 1 }).withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(baseResponse({ Success: false, Message: 'Validation error', Object: null, Errors: errors.array().map(e => e.msg) }));
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('id username email password role -_id').lean();
      if (!user) {
        return res.status(401).json(baseResponse({ Success: false, Message: 'Invalid credentials', Object: null, Errors: ['Invalid credentials'] }));
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json(baseResponse({ Success: false, Message: 'Invalid credentials', Object: null, Errors: ['Invalid credentials'] }));
      }

      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json(baseResponse({ Success: true, Message: 'Login successful', Object: { token }, Errors: null }));
    } catch (err) {
      console.error(err);
      return res.status(500).json(baseResponse({ Success: false, Message: 'Server error', Object: null, Errors: null }));
    }
  }
);

module.exports = router;
