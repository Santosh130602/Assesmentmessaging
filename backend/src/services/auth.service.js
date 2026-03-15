const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');

// ─── Token generation ────────────────────────────────────────────────────────
const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

const generateTokenPair = (userId) => ({
  accessToken: signAccessToken(userId),
  refreshToken: signRefreshToken(userId),
});

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password });
  const tokens = generateTokenPair(user._id);

  return { user, tokens };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  // Fetch user WITH password (select: false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    // Generic message to prevent user enumeration
    throw new AppError('Invalid email or password.', 401);
  }

  const tokens = generateTokenPair(user._id);

  // Strip password from returned user
  user.password = undefined;

  return { user, tokens };
};

// ─── Refresh access token ─────────────────────────────────────────────────────
const refreshToken = async (token) => {
  if (!token) throw new AppError('Refresh token is required.', 400);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User no longer exists.', 401);

  return { accessToken: signAccessToken(user._id) };
};

// ─── Change password ──────────────────────────────────────────────────────────
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();
};

// ─── Get current user ─────────────────────────────────────────────────────────
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

module.exports = { register, login, refreshToken, changePassword, getMe };
