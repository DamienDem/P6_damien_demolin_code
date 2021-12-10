const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongooseErrors = require('mongoose-errors');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.token = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = req.token.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    mongooseErrors(
      res.status(401).json({
        error: error
      })
    )
  }
};