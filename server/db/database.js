import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from './seed.js';
import { runMigrations } from './migrate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, '..', 'data', 'sanctum.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('patient', 'professional')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS patient_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      psychologist_id INTEGER NOT NULL REFERENCES users(id),
      risk_level TEXT DEFAULT 'low' CHECK(risk_level IN ('low', 'medium', 'high')),
      diagnosis TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_by INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      due_label TEXT,
      protocol TEXT,
      done INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      anxiety INTEGER NOT NULL,
      depression INTEGER NOT NULL,
      energy INTEGER NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      situation TEXT,
      thought TEXT,
      emotion TEXT,
      reframe TEXT,
      intensity_before INTEGER,
      intensity_after INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      psychologist_id INTEGER NOT NULL REFERENCES users(id),
      patient_user_id INTEGER REFERENCES users(id),
      appointment_time TEXT NOT NULL,
      period TEXT,
      title TEXT NOT NULL,
      active INTEGER DEFAULT 0,
      appointment_date TEXT DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS clinical_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      psychologist_id INTEGER NOT NULL REFERENCES users(id),
      patient_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  runMigrations(db);

  const count = db.prepare('SELECT COUNT(*) as n FROM users').get();
  if (count.n === 0 && process.env.SEED_DEMO_DATA !== 'false') {
    seedDatabase(db);
    console.log('Base de datos inicializada con datos de ejemplo.');
  }
}
