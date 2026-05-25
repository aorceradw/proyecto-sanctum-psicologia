import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sanctum-dev-secret-change-me';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

export function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      req.user = payload;
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    } catch {
      return res.status(401).json({ error: 'Sesión expirada' });
    }
  };
}

export function getPatientProfile(db, userId) {
  return db
    .prepare('SELECT * FROM patient_profiles WHERE user_id = ?')
    .get(userId);
}
