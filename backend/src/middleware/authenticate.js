const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('./errorHandler');

const authenticate = async (req, res, next) => {
  try {
    // 1) Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after token was issued
    if (user.passwordChangedAfter(decoded.iat)) {
      return next(new AppError('Password was recently changed. Please log in again.', 401));
    }

    // 5) Attach user to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
