const { baseResponse } = require('../utils/response');

function notFound(req, res, next) {
  res.status(404).json(baseResponse({ Success: false, Message: 'Not Found', Object: null, Errors: ['Route not found'] }));
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json(baseResponse({ Success: false, Message: err.message || 'Server Error', Object: null, Errors: err.errors || null }));
}

module.exports = { notFound, errorHandler };
