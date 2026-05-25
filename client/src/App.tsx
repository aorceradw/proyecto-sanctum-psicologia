import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ClientLayout } from './layouts/ClientLayout';
import { PsychologistLayout } from './layouts/PsychologistLayout';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientHomePage } from './pages/client/ClientHomePage';
import { ClientThoughtRecordPage } from './pages/client/ClientThoughtRecordPage';
import { ClientMoodPage } from './pages/client/ClientMoodPage';
import { ClientTasksPage } from './pages/client/ClientTasksPage';
import { ClientBreathingPage } from './pages/client/ClientBreathingPage';
import { PsychologistDashboard } from './pages/psychologist/PsychologistDashboard';
import { PsychologistPatientsPage } from './pages/psychologist/PsychologistPatientsPage';
import { PsychologistPatientDetail } from './pages/psychologist/PsychologistPatientDetail';
import { PsychologistSessionsPage } from './pages/psychologist/PsychologistSessionsPage';
import { PsychologistAccountPage } from './pages/psychologist/PsychologistAccountPage';
import { ClientAccountPage } from './pages/client/ClientAccountPage';
import { ClientJournalHistoryPage } from './pages/client/ClientJournalHistoryPage';

function HomeRoute() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'professional' ? '/psicologo' : '/cliente'} replace />;
  }
  return <PublicLandingPage />;
}

function LegacyRedirect({ to }: { to: string }) {
  return <Navigate to={to} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/crear-cuenta" element={<RegisterPage />} />

          {/* —— Portal del paciente —— */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute role="patient">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientHomePage />} />
            <Route path="registro" element={<ClientThoughtRecordPage />} />
            <Route path="historial" element={<ClientJournalHistoryPage />} />
            <Route path="estado" element={<ClientMoodPage />} />
            <Route path="tareas" element={<ClientTasksPage />} />
            <Route path="respiracion" element={<ClientBreathingPage />} />
            <Route path="cuenta" element={<ClientAccountPage />} />
          </Route>

          {/* —— Suite del psicólogo —— */}
          <Route
            path="/psicologo"
            element={
              <ProtectedRoute role="professional">
                <PsychologistLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PsychologistDashboard />} />
            <Route path="pacientes" element={<PsychologistPatientsPage />} />
            <Route path="paciente/:id" element={<PsychologistPatientDetail />} />
            <Route path="citas" element={<PsychologistSessionsPage />} />
            <Route path="cuenta" element={<PsychologistAccountPage />} />
            <Route path="sesiones" element={<PsychologistSessionsPage />} />
            <Route path="recursos" element={<PsychologistAccountPage />} />
          </Route>

          {/* Rutas antiguas → nuevas */}
          <Route path="/sanctuary/*" element={<LegacyRedirect to="/cliente" />} />
          <Route path="/rituales" element={<LegacyRedirect to="/cliente/respiracion" />} />
          <Route path="/cartografia" element={<LegacyRedirect to="/cliente/registro" />} />
          <Route path="/profesional/*" element={<LegacyRedirect to="/psicologo" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
