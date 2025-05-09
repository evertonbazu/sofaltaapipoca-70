
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle, Settings, Home, LogOut } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Navbar } from "@/components/ui/navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex-1 flex">
        <Collapsible open={isSidebarOpen} onOpenChange={setIsSidebarOpen} className="h-full">
          <CollapsibleContent forceMount className={`${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300 bg-white border-r shadow-sm h-full`}>
            <div className="py-4 flex flex-col h-full">
              <Link to="/" className="px-4 py-2 text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                <Home className="h-5 w-5" />
                <span>Voltar ao Site</span>
              </Link>
              
              <div className="mt-6 px-4">
                <h2 className="text-xs font-semibold text-gray-400 mb-2">MENUS</h2>
                <nav className="space-y-1">
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                      isActive('/admin')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/anuncios"
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                      isActive('/admin/anuncios')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                    <span>Gerenciar Anúncios</span>
                  </Link>
                  <Link
                    to="/admin/pendentes"
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                      isActive('/admin/pendentes')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Aprovar Anúncios</span>
                  </Link>
                  <Link
                    to="/admin/usuarios"
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                      isActive('/admin/usuarios')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Gerenciar Usuários</span>
                  </Link>
                </nav>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex flex-col flex-1">
          <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <span>×</span> : <span>☰</span>}
              </Button>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user?.user_metadata?.nome || 'Administrador'}</span>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
