
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Institutions from "./pages/Institutions";
import BirthRegistration from "./pages/register/BirthRegistration";
import MarriageRegistration from "./pages/register/MarriageRegistration";
import DivorceRegistration from "./pages/register/DivorceRegistration";
import AdoptionRegistration from "./pages/register/AdoptionRegistration";
import DeathRegistration from "./pages/register/DeathRegistration";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/records" element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute roles={['registrar', 'office_manager', 'health_institution', 'court', 'religious_institution']}>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute roles={['office_manager']}>
                <Analytics />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            <Route path="/institutions" element={
              <ProtectedRoute roles={['admin']}>
                <Institutions />
              </ProtectedRoute>
            } />
            
            {/* Profile Route - Accessible to all authenticated users */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Registration Routes */}
            <Route path="/register/birth" element={
              <ProtectedRoute roles={['registrar', 'health_institution']}>
                <BirthRegistration />
              </ProtectedRoute>
            } />
            
            <Route path="/register/marriage" element={
              <ProtectedRoute roles={['registrar', 'religious_institution', 'court']}>
                <MarriageRegistration />
              </ProtectedRoute>
            } />

            {/* Placeholder routes for other registration types */}
            <Route path="/register/death" element={
              <ProtectedRoute roles={['registrar', 'health_institution']}>
                <DeathRegistration />
              </ProtectedRoute>
            } />

            <Route path="/register/divorce" element={
              <ProtectedRoute roles={['registrar', 'court']}>
                <DivorceRegistration />
              </ProtectedRoute>
            } />

            <Route path="/register/adoption" element={
              <ProtectedRoute roles={['registrar', 'court']}>
                <AdoptionRegistration />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
