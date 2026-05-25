import { createContext, useContext, useState, type ReactNode } from 'react';
import { networkErrorMessage, parseApiError } from '../lib/apiError';

export type UserRole = 'patient' | 'professional';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface RegisterPatientInput {
  name: string;
  email: string;
  password: string;
  psychologistCode: string;
}

export interface RegisterProfessionalInput {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  registerPatient: (data: RegisterPatientInput) => Promise<User>;
  registerProfessional: (data: RegisterProfessionalInput) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'sanctum_auth';

function loadStored(): { user: User; token: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function authRequest(
  path: string,
  body: object,
  fallbackError: string,
): Promise<{ user: User; token: string }> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(networkErrorMessage(err));
  }

  if (!res.ok) {
    throw new Error(await parseApiError(res, fallbackError));
  }

  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadStored();
  const [user, setUser] = useState<User | null>(stored?.user ?? null);
  const [token, setToken] = useState<string | null>(stored?.token ?? null);

  const persistSession = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  };

  const login = async (email: string, password: string) => {
    const data = await authRequest(
      '/api/auth/login',
      { email, password },
      'Error al iniciar sesión',
    );
    persistSession(data.user, data.token);
    return data.user;
  };

  const registerPatient = async (input: RegisterPatientInput) => {
    const data = await authRequest(
      '/api/auth/register',
      { ...input, role: 'patient' },
      'Error al registrarse',
    );
    persistSession(data.user, data.token);
    return data.user;
  };

  const registerProfessional = async (input: RegisterProfessionalInput) => {
    const data = await authRequest(
      '/api/auth/register',
      { ...input, role: 'professional' },
      'Error al registrarse',
    );
    persistSession(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, registerPatient, registerProfessional, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
