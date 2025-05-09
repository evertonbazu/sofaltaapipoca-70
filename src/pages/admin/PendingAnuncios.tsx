
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Anuncio, Usuario } from "@/types/databaseTypes";

type AnuncioWithUsuario = Anuncio & { 
  usuarios?: Pick<Usuario, 'nome' | 'email'> 
};

const PendingAnuncios = () => {
  const queryClient = useQueryClient();
  const [selectedAnuncio, setSelectedAnuncio] = useState<AnuncioWithUsuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: pendingAnuncios, isLoading } = useQuery({
    queryKey: ['pendingAnuncios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*, usuarios(nome, email)')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AnuncioWithUsuario[];
    }
  });
  
  const handleViewDetails = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio);
    setIsDialogOpen(true);
  };
  
  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from('anuncios')
        .update({ status: 'aprovado' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Anúncio aprovado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['pendingAnuncios'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao aprovar anúncio: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      
      const { error } = await supabase
        .from('anuncios')
        .update({ status: 'rejeitado' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Anúncio rejeitado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['pendingAnuncios'] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao rejeitar anúncio: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Anúncios Pendentes</h1>
        <p className="text-gray-500 mt-1">Aprove ou rejeite anúncios submetidos pelos usuários</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Anúncios Pendentes</CardTitle>
          <CardDescription>
            Revise os anúncios antes de publicá-los
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : pendingAnuncios && pendingAnuncios.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAnuncios.map((anuncio) => (
                    <TableRow key={anuncio.id}>
                      <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                      <TableCell>{anuncio.usuarios?.nome || 'Usuário desconhecido'}</TableCell>
                      <TableCell>
                        {new Date(anuncio.created_at || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(anuncio)}
                          >
                            Detalhes
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(anuncio.id)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(anuncio.id)}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Não há anúncios pendentes de aprovação.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Anúncio</DialogTitle>
            <DialogDescription>
              Revise os detalhes antes de aprovar ou rejeitar
            </DialogDescription>
          </DialogHeader>
          
          {selectedAnuncio && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Título</h3>
                <p>{selectedAnuncio.titulo}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Descrição</h3>
                <p className="whitespace-pre-line">{selectedAnuncio.descricao}</p>
              </div>
              
              {selectedAnuncio.imagem && (
                <div>
                  <h3 className="font-semibold">Imagem</h3>
                  <div className="mt-2">
                    <img 
                      src={selectedAnuncio.imagem} 
                      alt={selectedAnuncio.titulo} 
                      className="max-h-40 rounded-md object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x200?text=Imagem+não+disponível";
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Fechar
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => handleReject(selectedAnuncio.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Rejeitar"
                  )}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => handleApprove(selectedAnuncio.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Aprovar"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PendingAnuncios;
