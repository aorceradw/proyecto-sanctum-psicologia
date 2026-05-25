import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth(['professional']));

function psychId(req) {
  return Number(req.user.id);
}

function assertPatient(pid, patientUserId) {
  return db
    .prepare('SELECT 1 FROM patient_profiles WHERE user_id = ? AND psychologist_id = ?')
    .get(patientUserId, pid);
}

router.get('/profile', (req, res) => {
  const pid = psychId(req);
  const row = db.prepare('SELECT name, email, invite_code, collegiate_number FROM users WHERE id = ?').get(pid);
  const patientCount = db
    .prepare('SELECT COUNT(*) as n FROM patient_profiles WHERE psychologist_id = ?')
    .get(pid).n;
  res.json({
    name: row.name,
    email: row.email,
    inviteCode: row.invite_code,
    collegiateNumber: row.collegiate_number,
    patientCount,
  });
});

router.patch('/profile', (req, res) => {
  const pid = psychId(req);
  const { collegiateNumber } = req.body;
  if (collegiateNumber !== undefined) {
    db.prepare('UPDATE users SET collegiate_number = ? WHERE id = ?').run(collegiateNumber, pid);
  }
  res.json({ success: true });
});

router.get('/dashboard', (req, res) => {
  const pid = psychId(req);
  const patients = db
    .prepare(
      `SELECT u.id, u.name, pp.risk_level
       FROM users u
       JOIN patient_profiles pp ON pp.user_id = u.id
       WHERE pp.psychologist_id = ?`,
    )
    .all(pid);

  const totalTasks = db
    .prepare(
      `SELECT COUNT(*) as total, SUM(done) as done FROM tasks t
       JOIN patient_profiles pp ON pp.user_id = t.patient_user_id
       WHERE pp.psychologist_id = ?`,
    )
    .get(pid);

  const adherence =
    totalTasks?.total > 0
      ? Math.round((totalTasks.done / totalTasks.total) * 100)
      : 0;

  const journalWeek = db
    .prepare(
      `SELECT COUNT(*) as n FROM journal_entries j
       JOIN patient_profiles pp ON pp.user_id = j.patient_user_id
       WHERE pp.psychologist_id = ? AND j.created_at >= datetime('now', '-7 days')`,
    )
    .get(pid).n;

  const moodWeek = db
    .prepare(
      `SELECT COUNT(*) as n FROM mood_entries m
       JOIN patient_profiles pp ON pp.user_id = m.patient_user_id
       WHERE pp.psychologist_id = ? AND m.created_at >= datetime('now', '-7 days')`,
    )
    .get(pid).n;

  const appointments = db
    .prepare(
      `SELECT a.id, a.appointment_date as date, a.appointment_time as time, a.period, a.title as type, a.active,
              u.name as patient, a.patient_user_id
       FROM appointments a
       LEFT JOIN users u ON u.id = a.patient_user_id
       WHERE a.psychologist_id = ? AND a.appointment_date >= date('now')
       ORDER BY a.appointment_date ASC, a.appointment_time ASC
       LIMIT 15`,
    )
    .all(pid);

  const alerts = [];
  for (const p of patients) {
    const pending = db
      .prepare('SELECT COUNT(*) as n FROM tasks WHERE patient_user_id = ? AND done = 0')
      .get(p.id).n;
    if (p.risk_level === 'high' || pending >= 3) {
      alerts.push({
        patient: p.name,
        patientId: String(p.id),
        level: p.risk_level === 'high' ? 'Riesgo elevado' : 'Seguimiento',
        text:
          pending >= 3
            ? `${pending} tareas pendientes. Revisar adherencia.`
            : `Riesgo elevado detectado. Revisar expediente.`,
        action: 'Ver expediente',
        severity: p.risk_level === 'high' ? 'error' : 'warn',
      });
    }
  }

  const profile = db.prepare('SELECT invite_code, name FROM users WHERE id = ?').get(pid);

  res.json({
    inviteCode: profile?.invite_code || null,
    professionalName: profile?.name,
    stats: {
      patientCount: patients.length,
      pendingTasksTotal: db
        .prepare(
          `SELECT COUNT(*) as n FROM tasks t
           JOIN patient_profiles pp ON pp.user_id = t.patient_user_id
           WHERE pp.psychologist_id = ? AND t.done = 0`,
        )
        .get(pid).n,
    },
    cohortMetrics: [
      { name: 'Adherencia tareas', value: adherence, trend: 0 },
      { name: 'Entradas diario (7d)', value: Math.min(100, journalWeek * 15), trend: 0 },
      { name: 'Check-ins ánimo (7d)', value: Math.min(100, moodWeek * 15), trend: 0 },
    ],
    appointments: appointments.map((a) => ({
      id: String(a.id),
      patientId: a.patient_user_id ? String(a.patient_user_id) : null,
      date: a.date,
      time: a.time,
      period: a.period,
      patient: a.patient || 'Sin asignar',
      type: a.type,
      active: Boolean(a.active),
    })),
    alerts: alerts.slice(0, 5),
  });
});

router.get('/patients', (req, res) => {
  const pid = psychId(req);
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.email, pp.risk_level, pp.diagnosis,
        (SELECT COUNT(*) FROM tasks t WHERE t.patient_user_id = u.id AND t.done = 0) as pending_tasks,
        (SELECT MAX(created_at) FROM journal_entries j WHERE j.patient_user_id = u.id) as last_journal
       FROM users u
       JOIN patient_profiles pp ON pp.user_id = u.id
       WHERE pp.psychologist_id = ?
       ORDER BY u.name`,
    )
    .all(pid);

  const patients = rows.map((p) => {
    const total = db
      .prepare('SELECT COUNT(*) as n, SUM(done) as d FROM tasks WHERE patient_user_id = ?')
      .get(p.id);
    const adherence = total?.n > 0 ? Math.round(((total.d || 0) / total.n) * 100) : 0;
    return {
      id: String(p.id),
      name: p.name,
      email: p.email,
      diagnosis: p.diagnosis || 'Sin diagnóstico registrado',
      risk: p.risk_level,
      adherence,
      pendingTasks: p.pending_tasks,
      lastActivity: p.last_journal
        ? new Date(p.last_journal).toLocaleDateString('es-ES')
        : 'Sin actividad',
    };
  });

  res.json({ patients });
});

router.get('/patients/:id', (req, res) => {
  const pid = psychId(req);
  const patientUserId = Number(req.params.id);

  const profile = db
    .prepare(
      `SELECT u.id, u.name, u.email, pp.risk_level, pp.diagnosis
       FROM users u
       JOIN patient_profiles pp ON pp.user_id = u.id
       WHERE u.id = ? AND pp.psychologist_id = ?`,
    )
    .get(patientUserId, pid);

  if (!profile) return res.status(404).json({ error: 'Paciente no encontrado' });

  const tasks = db
    .prepare(
      `SELECT id, title, type, due_label as due, protocol, done
       FROM tasks WHERE patient_user_id = ? ORDER BY done ASC, id DESC`,
    )
    .all(patientUserId);

  const doneCount = tasks.filter((t) => t.done).length;
  const total = tasks.length || 1;

  const journal = db
    .prepare(
      `SELECT situation, thought, emotion, created_at FROM journal_entries
       WHERE patient_user_id = ? ORDER BY created_at DESC LIMIT 8`,
    )
    .all(patientUserId);

  const moods = db
    .prepare(
      `SELECT anxiety, depression, energy, created_at FROM mood_entries
       WHERE patient_user_id = ? ORDER BY created_at DESC LIMIT 7`,
    )
    .all(patientUserId);

  const note = db
    .prepare(
      `SELECT content FROM clinical_notes
       WHERE patient_user_id = ? AND psychologist_id = ?
       ORDER BY updated_at DESC LIMIT 1`,
    )
    .get(patientUserId, pid);

  res.json({
    id: String(profile.id),
    name: profile.name,
    email: profile.email,
    diagnosis: profile.diagnosis || '',
    risk: profile.risk_level,
    lastContact: journal[0]
      ? new Date(journal[0].created_at).toLocaleString('es-ES')
      : 'Sin registros recientes',
    metrics: {
      taskAdherence: Math.round((doneCount / total) * 100),
      journalCount7d: db
        .prepare(
          `SELECT COUNT(*) as n FROM journal_entries
           WHERE patient_user_id = ? AND created_at >= datetime('now', '-7 days')`,
        )
        .get(patientUserId).n,
      moodCount7d: moods.length,
    },
    tasks: tasks.map((t) => ({
      id: String(t.id),
      title: t.title,
      type: t.type,
      due: t.due || '',
      protocol: t.protocol || '',
      done: Boolean(t.done),
    })),
    journal: journal.map((j) => ({
      date: new Date(j.created_at).toLocaleString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      mood:
        j.emotion?.toLowerCase().includes('ansiedad') || (j.thought?.length || 0) > 80
          ? 'negative'
          : 'positive',
      text: j.thought || j.situation || j.emotion || '',
    })),
    moodHistory: moods.reverse(),
    clinicalNote: note?.content || '',
  });
});

router.patch('/patients/:id', (req, res) => {
  const pid = psychId(req);
  const patientUserId = Number(req.params.id);
  if (!assertPatient(pid, patientUserId)) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const { riskLevel, diagnosis } = req.body;
  db.prepare(
    `UPDATE patient_profiles SET
      risk_level = COALESCE(?, risk_level),
      diagnosis = COALESCE(?, diagnosis)
     WHERE user_id = ?`,
  ).run(riskLevel ?? null, diagnosis ?? null, patientUserId);

  res.json({ success: true });
});

router.put('/patients/:id/notes', (req, res) => {
  const pid = psychId(req);
  const patientUserId = Number(req.params.id);
  const { content } = req.body;

  if (!assertPatient(pid, patientUserId)) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const prev = db
    .prepare(
      'SELECT id FROM clinical_notes WHERE psychologist_id = ? AND patient_user_id = ?',
    )
    .get(pid, patientUserId);

  if (prev) {
    db.prepare(
      `UPDATE clinical_notes SET content = ?, updated_at = datetime('now') WHERE id = ?`,
    ).run(content, prev.id);
  } else {
    db.prepare(
      `INSERT INTO clinical_notes (psychologist_id, patient_user_id, content) VALUES (?, ?, ?)`,
    ).run(pid, patientUserId, content);
  }

  res.json({ success: true });
});

router.post('/patients/:id/tasks', (req, res) => {
  const pid = psychId(req);
  const patientUserId = Number(req.params.id);
  const { title, type, dueLabel, protocol } = req.body;

  if (!title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
  if (!assertPatient(pid, patientUserId)) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  const result = db
    .prepare(
      `INSERT INTO tasks (patient_user_id, assigned_by, title, type, due_label, protocol)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      patientUserId,
      pid,
      title.trim(),
      type || 'General',
      dueLabel || 'Esta semana',
      protocol || '',
    );

  res.status(201).json({ id: String(result.lastInsertRowid), success: true });
});

router.delete('/patients/:patientId/tasks/:taskId', (req, res) => {
  const pid = psychId(req);
  const patientUserId = Number(req.params.patientId);
  const taskId = Number(req.params.taskId);

  if (!assertPatient(pid, patientUserId)) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ? AND patient_user_id = ?').run(taskId, patientUserId);
  res.json({ success: true });
});

router.get('/mood-progress', (req, res) => {
  const pid = psychId(req);

  // Get mood progress for each patient
  const patients = db
    .prepare(
      `SELECT u.id, u.name FROM users u
       JOIN patient_profiles pp ON pp.user_id = u.id
       WHERE pp.psychologist_id = ? AND u.role = 'patient'
       ORDER BY u.name ASC`,
    )
    .all(pid);

  const moodData = patients.map((patient) => {
    // Get latest mood entry
    const latestMood = db
      .prepare(
        `SELECT anxiety, depression, energy, created_at
         FROM mood_entries
         WHERE patient_user_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
      )
      .get(patient.id);

    // Get mood trend (last 7 days average)
    const weekAvg = db
      .prepare(
        `SELECT AVG(anxiety) as anxiety, AVG(depression) as depression, AVG(energy) as energy
         FROM mood_entries
         WHERE patient_user_id = ? AND created_at >= datetime('now', '-7 days')`,
      )
      .get(patient.id);

    return {
      patientId: String(patient.id),
      patientName: patient.name,
      latestMood: latestMood ? {
        anxiety: latestMood.anxiety,
        depression: latestMood.depression,
        energy: latestMood.energy,
        date: latestMood.created_at,
      } : null,
      weekAverage: weekAvg ? {
        anxiety: Math.round(weekAvg.anxiety || 0),
        depression: Math.round(weekAvg.depression || 0),
        energy: Math.round(weekAvg.energy || 0),
      } : null,
    };
  });

  res.json({ moodProgress: moodData });
});

router.get('/appointments', (req, res) => {
  const pid = psychId(req);
  const rows = db
    .prepare(
      `SELECT a.id, a.appointment_date as date, a.appointment_time as time, a.period,
              a.title, a.active, a.patient_user_id, u.name as patientName
       FROM appointments a
       LEFT JOIN users u ON u.id = a.patient_user_id
       WHERE a.psychologist_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT 50`,
    )
    .all(pid);

  res.json({
    appointments: rows.map((a) => ({
      id: String(a.id),
      date: a.date,
      time: a.time,
      period: a.period,
      title: a.title,
      active: Boolean(a.active),
      patientId: a.patient_user_id ? String(a.patient_user_id) : null,
      patientName: a.patientName || 'Sin paciente',
    })),
  });
});

router.post('/appointments', (req, res) => {
  const pid = psychId(req);
  const { patientId, date, time, period, title } = req.body;

  if (!date || !time || !title?.trim()) {
    return res.status(400).json({ error: 'Fecha, hora y título son obligatorios' });
  }

  if (patientId) {
    const patientUserId = Number(patientId);
    if (!assertPatient(pid, patientUserId)) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
  }

  const result = db
    .prepare(
      `INSERT INTO appointments (psychologist_id, patient_user_id, appointment_date, appointment_time, period, title)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      pid,
      patientId ? Number(patientId) : null,
      date,
      time,
      period || '',
      title.trim(),
    );

  res.status(201).json({ id: String(result.lastInsertRowid), success: true });
});

router.delete('/appointments/:id', (req, res) => {
  const pid = psychId(req);
  db.prepare('DELETE FROM appointments WHERE id = ? AND psychologist_id = ?').run(
    Number(req.params.id),
    pid,
  );
  res.json({ success: true });
});

export default router;
