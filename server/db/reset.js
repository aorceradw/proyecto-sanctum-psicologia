import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'sanctum.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Base de datos eliminada.');
}

const { initDatabase } = await import('./database.js');
initDatabase();
console.log('Base de datos recreada con datos de ejemplo.');
