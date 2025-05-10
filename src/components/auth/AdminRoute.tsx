
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isAdmin, userProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Verifica se o usuário está logado e é administrador
  if (!user || !isAdmin || !userProfile || userProfile.classe !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
