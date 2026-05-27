import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patient.js';
import professionalRoutes from './routes/professional.js';
import publicRoutes from './routes/public.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

try {
  initDatabase();
  console.log('Base de datos SQLite lista.');
} catch (err) {
  console.error('Error al iniciar la base de datos:', err.message);
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://192.168.2.150',
  'http://192.168.2.150:3001',
];
if (RENDER_URL) allowedOrigins.push(RENDER_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Sanctum API', database: true, environment: NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/professional', professionalRoutes);

// Producción: servir el build del cliente si existe
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

const server = app.listen(PORT, HOST, () => {
  console.log(`✓ Sanctum API corriendo en ${NODE_ENV} mode`);
  console.log(`✓ http://${HOST}:${PORT}`);
  console.log(`✓ Cliente: ${CLIENT_ORIGIN}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Puerto ${PORT} ocupado. Cierra el otro proceso o usa PORT=3002 en .env`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
