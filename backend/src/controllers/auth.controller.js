const authService = require('../services/auth.service');

const sendTokenResponse = (res, statusCode, user, tokens) => {
  res.status(statusCode).json({
    success: true,
    data: { user, tokens },
  });
};

const register = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.register(req.body);
    sendTokenResponse(res, 201, user, tokens);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.login(req.body);
    sendTokenResponse(res, 200, user, tokens);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, changePassword, getMe };
