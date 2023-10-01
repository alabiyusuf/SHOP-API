require('dotenv').config();
const jwt = require('jsonwebtoken');

function adminsOnly(req, res, next) {
  if (req.decoded.role == 'admin') {
    next();
  } else {
    return res.status(403).json({ message: `Action not allowed` });
  }
}

module.exports = { adminsOnly };
