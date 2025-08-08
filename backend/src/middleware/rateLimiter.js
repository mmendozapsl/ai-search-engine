const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: max || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to max requests per windowMs
    message: message || {
      error: 'Too many requests from this IP, please try again later.',
      statusCode: 429
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// API rate limiter - more restrictive for API endpoints
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  {
    error: 'Too many API requests from this IP, please try again later.',
    statusCode: 429
  }
);

// Strict rate limiter for sensitive operations
const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // Only 10 requests per window
  {
    error: 'Too many requests for this operation, please try again later.',
    statusCode: 429
  }
);

module.exports = {
  apiLimiter,
  strictLimiter,
  createRateLimiter
};