const { AppError } = require('./errorHandler');

/**
 * Middleware factory that validates req.body against a Joi schema.
 * Usage: router.post('/path', validate(mySchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,      // Collect all errors, not just the first
    allowUnknown: false,    // Reject unknown fields
    stripUnknown: true,     // Strip fields not in schema before passing on
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    return next(new AppError(messages, 422));
  }

  req.body = value; // Replace body with sanitized/coerced values
  next();
};

/**
 * Validate query parameters against a Joi schema.
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    return next(new AppError(messages, 422));
  }

  req.query = value;
  next();
};

module.exports = { validate, validateQuery };
