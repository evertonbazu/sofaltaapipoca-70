
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Anuncio } from "@/types/databaseTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const anuncioSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  imagem: z.string().optional(),
});

type AnuncioFormValues = z.infer<typeof anuncioSchema>;

const AnunciosAdmin = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<AnuncioFormValues>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      imagem: "",
    },
  });

  const editForm = useForm<AnuncioFormValues>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      imagem: "",
    },
  });

  const { data: anuncios, isLoading, refetch } = useQuery({
    queryKey: ['anuncios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Anuncio[];
    }
  });

  const onSubmit = async (formData: AnuncioFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar anúncios");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('anuncios')
        .insert([{
          titulo: formData.titulo,
          descricao: formData.descricao,
          imagem: formData.imagem || undefined,
          status: 'aprovado', // Admins podem criar anúncios já aprovados
          usuario_id: user.id,
        }]);

      if (error) throw error;
      
      toast.success("Anúncio criado com sucesso!");
      form.reset();
      refetch();
    } catch (error: any) {
      toast.error("Erro ao criar anúncio: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio);
    editForm.reset({
      titulo: anuncio.titulo,
      descricao: anuncio.descricao,
      imagem: anuncio.imagem || '',
    });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = async (formData: AnuncioFormValues) => {
    if (!selectedAnuncio) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('anuncios')
        .update({
          titulo: formData.titulo,
          descricao: formData.descricao,
          imagem: formData.imagem || undefined,
        })
        .eq('id', selectedAnuncio.id);

      if (error) throw error;
      
      toast.success("Anúncio atualizado com sucesso!");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error("Erro ao atualizar anúncio: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    
    try {
      const { error } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao excluir anúncio: " + error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Anúncios</h1>
        <p className="text-gray-500 mt-1">Crie e gerencie os anúncios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Novo Anúncio</CardTitle>
              <CardDescription>
                Preencha os campos para criar um novo anúncio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título do anúncio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detalhes do anúncio" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Criar Anúncio"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Anúncios Existentes</CardTitle>
              <CardDescription>
                Lista de todos os anúncios publicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : anuncios && anuncios.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {anuncios.map((anuncio) => (
                        <TableRow key={anuncio.id}>
                          <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                anuncio.status === 'aprovado'
                                  ? 'bg-green-100 text-green-800'
                                  : anuncio.status === 'pendente'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {anuncio.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(anuncio.created_at || '').toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(anuncio)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(anuncio.id)}
                              >
                                Excluir
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
                  Nenhum anúncio encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Anúncio</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do anúncio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes do anúncio" 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="imagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AnunciosAdmin;
