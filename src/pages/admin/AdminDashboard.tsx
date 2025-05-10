
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { fetchUsuarios, fetchAnuncios, fetchContatos } from "@/utils/databaseUtils";

const AdminDashboard = () => {
  const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios
  });

  const { data: anuncios, isLoading: isLoadingAnuncios } = useQuery({
    queryKey: ['anuncios'],
    queryFn: () => fetchAnuncios()
  });

  const { data: pendingAnuncios, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingAnuncios'],
    queryFn: () => fetchAnuncios('pendente')
  });

  const { data: contatos, isLoading: isLoadingContatos } = useQuery({
    queryKey: ['contatos'],
    queryFn: fetchContatos
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
              <p className="text-3xl font-bold">{usuarios ? usuarios.length : 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Anúncios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{anuncios ? anuncios.length : 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Anúncios Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingAnuncios ? pendingAnuncios.length : 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Mensagens de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{contatos ? contatos.length : 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
