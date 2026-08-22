import { query } from '../config/db.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const result = await query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

