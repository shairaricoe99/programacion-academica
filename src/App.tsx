import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppStateProvider } from "@/contexts/AppStateContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAlertas from "@/pages/admin/AdminAlertas";
import AdminEstadisticas from "@/pages/admin/AdminEstadisticas";
import AdminUsuarios from "@/pages/admin/AdminUsuarios";

// Secretaria pages
import SecretariaDashboard from "@/pages/secretaria/SecretariaDashboard";
import SecretariaConflictos from "@/pages/secretaria/SecretariaConflictos";
import Programas from "@/pages/Programas";
import Docentes from "@/pages/Docentes";
import Salones from "@/pages/Salones";
import Programacion from "@/pages/Programacion";
import Reportes from "@/pages/Reportes";

// Docente pages
import DocenteDashboard from "@/pages/docente/DocenteDashboard";
import DocenteHorario from "@/pages/docente/DocenteHorario";
import DocenteDisponibilidad from "@/pages/docente/DocenteDisponibilidad";

// Shared
import Notificaciones from "@/pages/Notificaciones";
import Configuracion from "@/pages/Configuracion";
import Asistente from "@/pages/Asistente";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Routes>
        {user?.role === "admin" && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/alertas" element={<AdminAlertas />} />
            <Route path="/estadisticas" element={<AdminEstadisticas />} />
            <Route path="/usuarios" element={<AdminUsuarios />} />
          </>
        )}
        {user?.role === "secretaria" && (
          <>
            <Route path="/" element={<SecretariaDashboard />} />
            <Route path="/programacion" element={<Programacion />} />
            <Route path="/docentes" element={<Docentes />} />
            <Route path="/salones" element={<Salones />} />
            <Route path="/asignaturas" element={<Programas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/conflictos" element={<SecretariaConflictos />} />
          </>
        )}
        {user?.role === "docente" && (
          <>
            <Route path="/" element={<DocenteDashboard />} />
            <Route path="/mi-horario" element={<DocenteHorario />} />
            <Route path="/disponibilidad" element={<DocenteDisponibilidad />} />
          </>
        )}
        {/* Shared routes (all roles) */}
        <Route path="/asistente" element={<Asistente />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AuthGate() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>
            <AuthGate />
          </AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

