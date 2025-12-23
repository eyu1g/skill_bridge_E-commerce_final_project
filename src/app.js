const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const { notFound, errorHandler } = require('./middleware/errors');
const { baseResponse } = require('./utils/response');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json(baseResponse({ Success: true, Message: 'SkillBridge E-commerce API', Object: null, Errors: null }));
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
