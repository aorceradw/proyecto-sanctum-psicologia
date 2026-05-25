import crypto from 'crypto';

export function runMigrations(db) {
  const columns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
  if (!columns.includes('invite_code')) {
    db.exec('ALTER TABLE users ADD COLUMN invite_code TEXT');
    db.exec(
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code) WHERE invite_code IS NOT NULL',
    );
  }
  if (!columns.includes('collegiate_number')) {
    db.exec('ALTER TABLE users ADD COLUMN collegiate_number TEXT');
  }

  const patientProfilesColumns = db.prepare('PRAGMA table_info(patient_profiles)').all().map((c) => c.name);
  if (patientProfilesColumns.includes('phq9')) {
    try {
      db.exec('ALTER TABLE patient_profiles DROP COLUMN phq9');
    } catch (e) {
      console.error('No se pudo borrar phq9 (puede que SQLite versión no lo soporte):', e.message);
    }
  }

  const prosWithoutCode = db
    .prepare("SELECT id FROM users WHERE role = 'professional' AND (invite_code IS NULL OR invite_code = '')")
    .all();
  const update = db.prepare('UPDATE users SET invite_code = ? WHERE id = ?');
  for (const row of prosWithoutCode) {
    update.run(generateInviteCode(), row.id);
  }
}

export function generateInviteCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}
