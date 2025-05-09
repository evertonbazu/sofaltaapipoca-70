
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

const AdminDashboard = () => {
  const { data: usuariosCount, isLoading: isLoadingUsuarios } = useQuery({
    queryKey: ['usuariosCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: anunciosCount, isLoading: isLoadingAnuncios } = useQuery({
    queryKey: ['anunciosCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('anuncios')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: pendingCount, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('anuncios')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: contatosCount, isLoading: isLoadingContatos } = useQuery({
    queryKey: ['contatosCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contato')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const isLoading = isLoadingUsuarios || isLoadingAnuncios || isLoadingPending || isLoadingContatos;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Usuários Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{usuariosCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Anúncios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{anunciosCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Anúncios Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Mensagens de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{contatosCount || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
