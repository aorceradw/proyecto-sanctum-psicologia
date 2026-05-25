export async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data?.error) return String(data.error);
  } catch {
    /* ignore */
  }
  if (res.status === 502 || res.status === 503) {
    return 'El servidor no está disponible. Ejecuta npm run dev en la carpeta sanctum-app.';
  }
  return fallback;
}

export function networkErrorMessage(err: unknown): string {
  if (err instanceof TypeError && err.message.includes('fetch')) {
    return 'No hay conexión con el servidor. Abre una terminal, ve a sanctum-app y ejecuta: npm run dev';
  }
  if (err instanceof Error) return err.message;
  return 'Error de conexión';
}
