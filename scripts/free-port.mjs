/**
 * Libera un puerto TCP en Windows (uso local en desarrollo).
 * Uso: node scripts/free-port.mjs 3001
 */
import { execSync } from 'node:child_process';

const port = process.argv[2] || '3001';

try {
  const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split('\n')) {
    const m = line.match(/LISTENING\s+(\d+)\s*$/);
    if (m) pids.add(m[1]);
  }
  if (!pids.size) {
    console.log(`Puerto ${port} libre.`);
    process.exit(0);
  }
  for (const pid of pids) {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
    console.log(`Proceso ${pid} terminado.`);
  }
} catch {
  console.log(`Puerto ${port} libre (o sin procesos escuchando).`);
}
