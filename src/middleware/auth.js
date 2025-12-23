const jwt = require('jsonwebtoken');
const { baseResponse } = require('../utils/response');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json(baseResponse({ Success: false, Message: 'Unauthorized', Object: null, Errors: ['Missing token'] }));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json(baseResponse({ Success: false, Message: 'Unauthorized', Object: null, Errors: ['Invalid token'] }));
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(baseResponse({ Success: false, Message: 'Forbidden', Object: null, Errors: ['Insufficient permissions'] }));
    }
    next();
  };
}

module.exports = { authenticate, authorizeRoles };
