const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const { authRateLimiter } = require('../middleware/rateLimiter');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

// Public routes (strict rate limiting)
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authRateLimiter, authController.refreshToken);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getMe);
router.patch(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
