import bcrypt from 'bcryptjs';
import { generateInviteCode } from './migrate.js';

export function seedDatabase(db) {
  const hash = bcrypt.hashSync('sanctum123', 10);
  const doctorCode = generateInviteCode();

  const insertUser = db.prepare(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
  );

  const elenaId = insertUser.run('elena@ejemplo.com', hash, 'Elena', 'patient').lastInsertRowid;
  const doctorId = db
    .prepare(
      `INSERT INTO users (email, password_hash, name, role, invite_code)
       VALUES (?, ?, ?, 'professional', ?)`,
    )
    .run('doctor@sanctum.health', hash, 'Dra. Martínez', doctorCode).lastInsertRowid;

  db.prepare(
    `INSERT INTO patient_profiles (user_id, psychologist_id, risk_level, diagnosis)
     VALUES (?, ?, 'high', 'Ansiedad generalizada')`,
  ).run(elenaId, doctorId);

  db.prepare(
    `INSERT INTO patient_profiles (user_id, psychologist_id, risk_level, diagnosis)
     VALUES (?, ?, 'medium', 'Trastorno depresivo')`,
  ).run(
    insertUser.run('carlos@ejemplo.com', hash, 'Carlos V.', 'patient').lastInsertRowid,
    doctorId,
  );

  db.prepare(
    `INSERT INTO patient_profiles (user_id, psychologist_id, risk_level, diagnosis)
     VALUES (?, ?, 'low', 'TOC')`,
  ).run(
    insertUser.run('ana@ejemplo.com', hash, 'Ana S.', 'patient').lastInsertRowid,
    doctorId,
  );

  const insertTask = db.prepare(
    `INSERT INTO tasks (patient_user_id, assigned_by, title, type, due_label, protocol, done)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  insertTask.run(
    elenaId,
    doctorId,
    'Practicar respiración tranquila 5 min',
    'Calma',
    'Viernes',
    'Cuando notes nervios en el pecho',
    0,
  );
  insertTask.run(
    elenaId,
    doctorId,
    'Escribir en el diario después de una situación difícil',
    'Diario',
    'Diario',
    'Una vez al día',
    0,
  );
  insertTask.run(
    elenaId,
    doctorId,
    'Dar un paseo de 20 minutos',
    'Actividad',
    'Miércoles',
    'Sin auriculares, a tu ritmo',
    1,
  );
  insertTask.run(
    elenaId,
    doctorId,
    'Respirar antes de dormir',
    'Calma',
    'Diario',
    '10 minutos',
    0,
  );

  db.prepare(
    `INSERT INTO journal_entries (patient_user_id, situation, thought, emotion, reframe, intensity_before, intensity_after)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    elenaId,
    'Reunión de equipo',
    'Todos van a juzgar mi presentación',
    'Ansiedad 8/10',
    null,
    8,
    null,
  );

  db.prepare(
    `INSERT INTO mood_entries (patient_user_id, anxiety, depression, energy, note)
     VALUES (?, 6, 4, 7, 'Día tranquilo por la mañana')`,
  ).run(elenaId);

  db.prepare(
    `INSERT INTO appointments (psychologist_id, patient_user_id, appointment_time, period, title, active)
     VALUES (?, ?, '09:00', 'AM', 'Sesión de seguimiento', 0)`,
  ).run(doctorId, elenaId);

  db.prepare(
    `INSERT INTO appointments (psychologist_id, patient_user_id, appointment_time, period, title, active)
     VALUES (?, ?, '11:30', 'AM', 'Seguimiento ansiedad', 1)`,
  ).run(doctorId, elenaId);

  db.prepare(
    `INSERT INTO clinical_notes (psychologist_id, patient_user_id, content)
     VALUES (?, ?, ?)`,
  ).run(
    doctorId,
    elenaId,
    'Paciente refiere aumento de ansiedad anticipatoria. Revisar técnicas de respiración en próxima sesión.',
  );
}
