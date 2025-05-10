
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Anuncio } from "@/types/databaseTypes";
import { fetchAnuncios, updateAnuncio } from "@/utils/databaseUtils";
import { Badge } from "@/components/ui/badge";

// Definir o tipo AnuncioWithUsuario para corresponder exatamente ao formato dos dados retornados pela API
type AnuncioWithUsuario = {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'assinado' | 'em formação';
  usuario_id: string;
  created_at?: string;
  valor?: string;
  quantidade_vagas?: number;
  tipo_acesso?: string;
  tipo_envio?: 'login e senha' | 'ativação' | 'convite';
  pix?: string;
  data_criacao?: string;
  codigo?: string;
  telegram?: string;
  whatsapp?: string;
  usuarios?: { nome?: string; email?: string; };
};

const PendingAnuncios = () => {
  const queryClient = useQueryClient();
  const [selectedAnuncio, setSelectedAnuncio] = useState<AnuncioWithUsuario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: pendingAnuncios, isLoading } = useQuery({
    queryKey: ['pendingAnuncios'],
    queryFn: async () => {
      const anuncios = await fetchAnuncios('pendente');
      return anuncios as unknown as AnuncioWithUsuario[];
    }
  });
  
  const handleViewDetails = (anuncio: AnuncioWithUsuario) => {
    setSelectedAnuncio(anuncio);
    setIsDialogOpen(true);
  };
  
  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(true);
      
      // Ao aprovar, mantemos qualquer status específico como assinado ou em formação
      // Se não tiver, definimos como aprovado
      const anuncio = pendingAnuncios?.find(a => a.id === id);
      const newStatus = anuncio?.status === 'assinado' || anuncio?.status === 'em formação' 
        ? anuncio.status 
        : 'aprovado';
      
      await updateAnuncio(id, { status: newStatus });
      
      toast.success("Anúncio aprovado com sucesso!");
      
      // Importante: invalidamos as queries para atualizar tanto a lista de pendentes quanto a página inicial
      queryClient.invalidateQueries({ queryKey: ['pendingAnuncios'] });
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });
      
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
      
      await updateAnuncio(id, { status: 'rejeitado' });
      
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
                    <TableHead>Código</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAnuncios.map((anuncio) => (
                    <TableRow key={anuncio.id}>
                      <TableCell className="font-mono text-xs">{anuncio.codigo}</TableCell>
                      <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                      <TableCell>{anuncio.usuarios?.nome || 'Usuário desconhecido'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${anuncio.status === 'assinado' ? 'bg-green-100 text-green-800' : 
                              anuncio.status === 'em formação' ? 'bg-amber-100 text-amber-800' : 
                              'bg-yellow-100 text-yellow-800'}
                          `}
                        >
                          {anuncio.status === 'em formação' ? 'Em formação' : 
                           anuncio.status === 'assinado' ? 'Assinado' : 'Pendente'}
                        </Badge>
                      </TableCell>
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
                <h3 className="font-semibold">Código</h3>
                <p className="font-mono">{selectedAnuncio.codigo}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Título</h3>
                <p>{selectedAnuncio.titulo}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Descrição</h3>
                <p className="whitespace-pre-line">{selectedAnuncio.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Valor</h3>
                  <p>{selectedAnuncio.valor || 'Não informado'}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Status</h3>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${selectedAnuncio.status === 'assinado' ? 'bg-green-100 text-green-800' : 
                        selectedAnuncio.status === 'em formação' ? 'bg-amber-100 text-amber-800' : 
                        'bg-yellow-100 text-yellow-800'}
                    `}
                  >
                    {selectedAnuncio.status === 'em formação' ? 'Em formação' : 
                     selectedAnuncio.status === 'assinado' ? 'Assinado' : 'Pendente'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Tipo de Envio</h3>
                  <p>{selectedAnuncio.tipo_envio || 'Não informado'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Vagas</h3>
                  <p>{selectedAnuncio.quantidade_vagas || 'Não informado'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Telegram</h3>
                  <p>{selectedAnuncio.telegram || 'Não informado'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p>{selectedAnuncio.whatsapp || 'Não informado'}</p>
                </div>
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
