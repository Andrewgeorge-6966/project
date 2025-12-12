// Simple header-based admin guard using a shared token
module.exports = function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_TOKEN is not configured on the server' });
  }

  if (!token || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

