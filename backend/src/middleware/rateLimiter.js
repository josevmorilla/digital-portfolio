const rateLimit = require('express-rate-limit');

// ── Global limiter: 100 requests per 15 minutes per IP ──────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max: 100,                        // limit each IP to 100 requests per window
  standardHeaders: true,           // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,            // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' },
});

// ── Auth limiter: 5 login attempts per 15 minutes per IP ────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max: 5,                          // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

// ── Contact / Testimonial spam limiter: 3 submissions per 15 min ────
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max: 3,                          // 3 submissions
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

module.exports = { globalLimiter, authLimiter, formLimiter };
