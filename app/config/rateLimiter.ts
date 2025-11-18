import rateLimit from "express-rate-limit";

// Rate limiter for general API routes
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs` (15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  headers: true, // Send rate limit info in the response headers
});

// Rate limiter specifically for login routes
export const loginRateLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 5 minutes
  max: 20, // Limit to 5 requests per 5 minutes (to prevent brute force attacks)
  message:
    "Too many login attempts from this IP, please try again after 5 minutes",
  headers: true,
});
