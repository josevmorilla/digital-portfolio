const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

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

// ── Content-based anti-spam (catches VPN / IP-changers) ─────────────
// Stores hashes of recent submissions; blocks duplicates regardless of IP
const recentSubmissions = new Map();
const CONTENT_COOLDOWN = 10 * 60 * 1000; // 10 minutes

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions) {
    if (now - timestamp > CONTENT_COOLDOWN) recentSubmissions.delete(key);
  }
}, 15 * 60 * 1000);

/**
 * Middleware that blocks duplicate form submissions based on content fingerprint.
 * Works even if the user changes IP (VPN, proxy, etc.).
 * Also checks for honeypot field (bot trap).
 */
const contentSpamGuard = (req, res, next) => {
  // Honeypot: if a hidden "website" field is filled in, it's a bot
  if (req.body.website) {
    // Silently accept to not reveal the trap, but don't process
    return res.status(200).json({ message: 'Thank you for your submission.' });
  }

  // Build a fingerprint from the submission content
  const { name, email, message, content, position } = req.body;
  const raw = [name, email, message, content, position].filter(Boolean).join('|').toLowerCase().trim();
  const hash = crypto.createHash('sha256').update(raw).digest('hex');

  if (recentSubmissions.has(hash)) {
    return res.status(429).json({
      error: 'This content was already submitted recently. Please wait before submitting again.',
    });
  }

  recentSubmissions.set(hash, Date.now());
  next();
};

module.exports = { globalLimiter, authLimiter, formLimiter, contentSpamGuard };
