const rateLimit = require('express-rate-limit');

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,     // Disable `X-RateLimit-*` headers
    message: {
      success: false,
      message,
    },
    skipSuccessfulRequests: false,
  });

// Applied to all /api routes
const globalRateLimiter = createLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Strict limiter for auth endpoints
const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  message: 'Too many authentication attempts, please try again after 15 minutes.',
});

module.exports = { globalRateLimiter, authRateLimiter };
