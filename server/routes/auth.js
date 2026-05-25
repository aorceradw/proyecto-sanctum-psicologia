import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { generateInviteCode } from '../db/migrate.js';

const router = Router();

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function validatePassword(password) {
  if (!password || String(password).length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  return null;
}

router.post('/register', (req, res) => {
  const { name, email, password, role, psychologistCode } = req.body;

  if (!name?.trim() || !email || !password || !role) {
    return res.status(400).json({ error: 'Nombre, email, contraseña y rol son obligatorios' });
  }

  if (!['patient', 'professional'].includes(role)) {
    return res.status(400).json({ error: 'Rol no válido' });
  }

  const pwdError = validatePassword(password);
  if (pwdError) return res.status(400).json({ error: pwdError });

  const normalizedEmail = normalizeEmail(email);
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (exists) {
    return res.status(409).json({ error: 'Este correo ya está registrado' });
  }

  const hash = bcrypt.hashSync(password, 10);

  if (role === 'professional') {
    const inviteCode = generateInviteCode();
    const result = db
      .prepare(
        `INSERT INTO users (email, password_hash, name, role, invite_code)
         VALUES (?, ?, ?, 'professional', ?)`,
      )
      .run(normalizedEmail, hash, name.trim(), inviteCode);

    const user = {
      id: String(result.lastInsertRowid),
      email: normalizedEmail,
      name: name.trim(),
      role: 'professional',
      inviteCode,
    };

    return res.status(201).json({
      user,
      token: signToken(user),
      message: 'Cuenta profesional creada',
      inviteCode,
    });
  }

  // Paciente: requiere código del psicólogo/a
  const code = String(psychologistCode || '')
    .trim()
    .toUpperCase();
  if (!code) {
    return res.status(400).json({
      error: 'Introduce el código de invitación de tu psicólogo/a',
    });
  }

  const psychologist = db
    .prepare("SELECT id, name FROM users WHERE invite_code = ? AND role = 'professional'")
    .get(code);

  if (!psychologist) {
    return res.status(400).json({ error: 'Código de invitación no válido' });
  }

  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'patient')`,
    )
    .run(normalizedEmail, hash, name.trim());

  const patientId = result.lastInsertRowid;
  db.prepare(
    `INSERT INTO patient_profiles (user_id, psychologist_id, risk_level, diagnosis)
     VALUES (?, ?, 'low', NULL)`,
  ).run(patientId, psychologist.id);

  const user = {
    id: String(patientId),
    email: normalizedEmail,
    name: name.trim(),
    role: 'patient',
  };

  res.status(201).json({
    user,
    token: signToken(user),
    message: `Te has unido a la consulta de ${psychologist.name}`,
  });
});

router.get('/validate-invite/:code', (req, res) => {
  const code = String(req.params.code).trim().toUpperCase();
  const psych = db
    .prepare("SELECT name FROM users WHERE invite_code = ? AND role = 'professional'")
    .get(code);
  if (!psych) return res.status(404).json({ valid: false });
  res.json({ valid: true, psychologistName: psych.name });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const row = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(normalizeEmail(email));
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const user = {
    id: String(row.id),
    email: row.email,
    name: row.name,
    role: row.role,
  };

  res.json({ user, token: signToken(user) });
});

router.get('/me', requireAuth(), (req, res) => {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.user.id));
  res.json({
    user: {
      id: String(row.id),
      email: row.email,
      name: row.name,
      role: row.role,
      inviteCode: row.invite_code || undefined,
    },
  });
});

export default router;
