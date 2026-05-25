import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/info', (_req, res) => {
  const stats = {
    professionals: db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'professional'").get()
      .n,
    patients: db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'patient'").get().n,
    sessionsToday: db
      .prepare("SELECT COUNT(*) as n FROM appointments WHERE appointment_date = date('now')")
      .get().n,
  };
  res.json({
    name: 'Sanctum',
    tagline: 'Acompañamiento terapéutico entre sesiones',
    description:
      'Plataforma segura que conecta a personas en proceso terapéutico con su psicólogo/a: diario, tareas, estado de ánimo y herramientas de calma.',
    stats,
  });
});

export default router;
