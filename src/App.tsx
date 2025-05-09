
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AnunciosAdmin from "./pages/admin/AnunciosAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import PendingAnuncios from "./pages/admin/PendingAnuncios";
import ContatoPage from "./pages/ContatoPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            
            {/* Rotas protegidas - usuários autenticados */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/anuncios" element={
              <AdminRoute>
                <AnunciosAdmin />
              </AdminRoute>
            } />
            <Route path="/admin/usuarios" element={
              <AdminRoute>
                <UsuariosAdmin />
              </AdminRoute>
            } />
            <Route path="/admin/pendentes" element={
              <AdminRoute>
                <PendingAnuncios />
              </AdminRoute>
            } />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
