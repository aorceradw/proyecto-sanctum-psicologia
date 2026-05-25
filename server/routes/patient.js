import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth(['patient']));

function patientId(req) {
  return Number(req.user.id);
}

router.get('/dashboard', (req, res) => {
  const uid = patientId(req);
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(uid);
  const tasks = db
    .prepare('SELECT done FROM tasks WHERE patient_user_id = ?')
    .all(uid);
  const total = tasks.length || 1;
  const done = tasks.filter((t) => t.done).length;
  const journals = db
    .prepare(
      `SELECT COUNT(*) as n FROM journal_entries
       WHERE patient_user_id = ? AND created_at >= datetime('now', '-7 days')`,
    )
    .get(uid);
  const moods = db
    .prepare(
      `SELECT COUNT(*) as n FROM mood_entries
       WHERE patient_user_id = ? AND created_at >= datetime('now', '-7 days')`,
    )
    .get(uid);

  const psychologist = db
    .prepare(
      `SELECT u.name FROM users u
       JOIN patient_profiles p ON p.psychologist_id = u.id
       WHERE p.user_id = ?`,
    )
    .get(uid);

  const appointments = db
    .prepare(
      `SELECT id, appointment_date as date, appointment_time as time, period, title, active
       FROM appointments
       WHERE patient_user_id = ? AND appointment_date >= date('now')
       ORDER BY appointment_date ASC, appointment_time ASC
       LIMIT 10`,
    )
    .all(uid);

  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  const recentTasks = db
    .prepare(
      `SELECT id, title, type, done FROM tasks WHERE patient_user_id = ?
       ORDER BY done ASC, id DESC LIMIT 4`,
    )
    .all(uid);

  res.json({
    greeting: user?.name?.split(' ')[0] || 'Usuario',
    therapist: psychologist?.name || 'Tu psicólogo/a',
    nextSession: nextAppt
      ? `${nextAppt.time} ${nextAppt.period} · ${nextAppt.title}`
      : 'Sin cita programada',
    appointments: appointments.map((a) => ({
      id: String(a.id),
      date: a.date,
      time: a.time,
      period: a.period,
      title: a.title,
      active: Boolean(a.active),
    })),
    tasksDue: tasks.filter((t) => !t.done).length,
    recentTasks: recentTasks.map((t) => ({
      id: String(t.id),
      title: t.title,
      type: t.type,
      done: Boolean(t.done),
    })),
    progress: [
      { id: 'tasks', label: 'Tareas completadas', percent: Math.round((done / total) * 100) },
      { id: 'journal', label: 'Entradas en el diario', percent: Math.min(100, (journals?.n || 0) * 25) },
      { id: 'mood', label: 'Check-ins de ánimo', percent: Math.min(100, (moods?.n || 0) * 30) },
    ],
  });
});

router.get('/tasks', (req, res) => {
  const uid = patientId(req);
  const rows = db
    .prepare(
      `SELECT id, title, type, due_label as due, protocol, done
       FROM tasks WHERE patient_user_id = ? ORDER BY done ASC, id ASC`,
    )
    .all(uid);
  res.json({
    tasks: rows.map((t) => ({
      id: String(t.id),
      title: t.title,
      type: t.type,
      due: t.due || '',
      protocol: t.protocol || '',
      done: Boolean(t.done),
    })),
  });
});

router.patch('/tasks/:id', (req, res) => {
  const uid = patientId(req);
  const taskId = Number(req.params.id);
  const { done } = req.body;

  const task = db
    .prepare('SELECT * FROM tasks WHERE id = ? AND patient_user_id = ?')
    .get(taskId, uid);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  db.prepare('UPDATE tasks SET done = ? WHERE id = ?').run(done ? 1 : 0, taskId);

  const all = db.prepare('SELECT done FROM tasks WHERE patient_user_id = ?').all(uid);
  const allDone = all.length > 0 && all.every((t) => t.done);

  res.json({ success: true, allDone });
});

router.post('/mood', (req, res) => {
  const uid = patientId(req);
  const { anxiety, depression, energy, note } = req.body;
  db.prepare(
    `INSERT INTO mood_entries (patient_user_id, anxiety, depression, energy, note)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(uid, anxiety ?? 5, depression ?? 5, energy ?? 5, note || null);
  res.json({ success: true });
});

router.get('/mood/history', (req, res) => {
  const uid = patientId(req);
  const rows = db
    .prepare(
      `SELECT anxiety, depression, energy, created_at FROM mood_entries
       WHERE patient_user_id = ? ORDER BY created_at DESC LIMIT 7`,
    )
    .all(uid);
  res.json({ history: rows.reverse() });
});

router.post('/journal', (req, res) => {
  const uid = patientId(req);
  const { situation, thought, emotion, reframe, intensityBefore, intensityAfter } = req.body;
  db.prepare(
    `INSERT INTO journal_entries
     (patient_user_id, situation, thought, emotion, reframe, intensity_before, intensity_after)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    uid,
    situation || null,
    thought || null,
    emotion || null,
    reframe || null,
    intensityBefore ?? null,
    intensityAfter ?? null,
  );
  res.json({ success: true });
});

router.get('/profile', (req, res) => {
  const uid = patientId(req);
  const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(uid);
  const psych = db
    .prepare(
      `SELECT u.name, u.email FROM users u
       JOIN patient_profiles p ON p.psychologist_id = u.id
       WHERE p.user_id = ?`,
    )
    .get(uid);

  res.json({
    name: user?.name,
    email: user?.email,
    psychologist: psych
      ? { name: psych.name, email: psych.email }
      : null,
  });
});

router.get('/journal', (req, res) => {
  const uid = patientId(req);
  const rows = db
    .prepare(
      `SELECT id, situation, thought, emotion, reframe, created_at
       FROM journal_entries WHERE patient_user_id = ?
       ORDER BY created_at DESC LIMIT 20`,
    )
    .all(uid);

  res.json({
    entries: rows.map((r) => ({
      id: String(r.id),
      date: new Date(r.created_at).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      situation: r.situation,
      thought: r.thought,
      emotion: r.emotion,
      reframe: r.reframe,
    })),
  });
});

export default router;
