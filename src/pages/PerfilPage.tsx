
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { Loader, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Navbar } from "@/components/ui/navbar";
import { format } from "date-fns";
import { Anuncio } from "@/types/databaseTypes";

const perfilSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
});

const senhaSchema = z.object({
  senha_atual: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  nova_senha: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmar_senha: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
}).refine(data => data.nova_senha === data.confirmar_senha, {
  message: "As senhas não conferem",
  path: ["confirmar_senha"],
});

type PerfilFormValues = z.infer<typeof perfilSchema>;
type SenhaFormValues = z.infer<typeof senhaSchema>;

const PerfilPage = () => {
  const { user } = useAuth();
  const [isSubmittingPerfil, setIsSubmittingPerfil] = useState(false);
  const [isSubmittingSenha, setIsSubmittingSenha] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
  const queryClient = useQueryClient();
  
  const perfilForm = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: "",
    },
  });
  
  const senhaForm = useForm<SenhaFormValues>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      senha_atual: "",
      nova_senha: "",
      confirmar_senha: "",
    },
  });
  
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['usuario', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      perfilForm.reset({ nome: data.nome });
      return data;
    },
    enabled: !!user,
  });
  
  const { data: anuncios, isLoading: isLoadingAnuncios } = useQuery({
    queryKey: ['meusAnuncios', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
  const onSubmitPerfil = async (data: PerfilFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmittingPerfil(true);
      
      const { error } = await supabase
        .from('usuarios')
        .update({ nome: data.nome })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['usuario', user.id] });
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setIsSubmittingPerfil(false);
    }
  };
  
  const onSubmitSenha = async (data: SenhaFormValues) => {
    try {
      setIsSubmittingSenha(true);
      
      const { error } = await supabase.auth.updateUser({
        password: data.nova_senha,
      });
      
      if (error) throw error;
      
      // Registrar alteração de senha
      const { error: logError } = await supabase
        .from('alteracao_senha')
        .insert({ usuario_id: user?.id });
      
      if (logError) console.error("Erro ao registrar alteração de senha:", logError);
      
      toast.success("Senha atualizada com sucesso!");
      senhaForm.reset();
    } catch (error: any) {
      toast.error("Erro ao atualizar senha: " + error.message);
    } finally {
      setIsSubmittingSenha(false);
    }
  };
  
  const handleExcluirAnuncio = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio);
    setIsDialogOpen(true);
  };
  
  const confirmarExclusao = async () => {
    if (!selectedAnuncio) return;
    
    try {
      const { error } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', selectedAnuncio.id);
      
      if (error) throw error;
      
      toast.success("Anúncio excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['meusAnuncios', user?.id] });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao excluir anúncio: " + error.message);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Negado</CardTitle>
              <CardDescription>
                Você precisa estar logado para acessar esta página.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e anúncios</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editar Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUser ? (
                <div className="flex justify-center py-4">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Form {...perfilForm}>
                  <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)} className="space-y-4">
                    <FormField
                      control={perfilForm.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium">{userData?.email || user.email}</p>
                    </div>
                    
                    <Button type="submit" disabled={isSubmittingPerfil}>
                      {isSubmittingPerfil ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Alterações"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
          
          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Defina uma nova senha para sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...senhaForm}>
                <form onSubmit={senhaForm.handleSubmit(onSubmitSenha)} className="space-y-4">
                  <FormField
                    control={senhaForm.control}
                    name="senha_atual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={senhaForm.control}
                    name="nova_senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={senhaForm.control}
                    name="confirmar_senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmittingSenha}>
                    {isSubmittingSenha ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      "Alterar Senha"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Meus Anúncios */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Meus Anúncios</CardTitle>
            <CardDescription>Gerencie os anúncios que você enviou</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAnuncios ? (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            ) : anuncios && anuncios.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anuncios.map((anuncio) => (
                      <TableRow key={anuncio.id}>
                        <TableCell className="font-mono">{anuncio.codigo}</TableCell>
                        <TableCell>{anuncio.titulo}</TableCell>
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
                          {anuncio.data_criacao ? new Date(anuncio.data_criacao).toLocaleDateString() : 
                            anuncio.created_at ? new Date(anuncio.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleExcluirAnuncio(anuncio)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Você ainda não enviou nenhum anúncio.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerfilPage;
