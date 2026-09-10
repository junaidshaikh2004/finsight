const jwt = require('jsonwebtoken');

// Reads the JWT from the Authorization header and attaches the user id to
// the request. Every protected route depends on this.
//
// Not a cookie: frontend and backend live on different domains, and mobile
// Safari/Chrome increasingly block cross-site cookies outright, which made
// login silently fail to persist on phones while working fine on desktop.
// A Bearer token the client attaches explicitly has no such restriction.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

module.exports = requireAuth;
