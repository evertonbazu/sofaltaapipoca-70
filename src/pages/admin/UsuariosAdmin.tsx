import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Usuario } from "@/types/databaseTypes";
import { fetchUsuarios, updateUsuario, deleteUsuario } from "@/utils/databaseUtils";

const updateUserSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  classe: z.enum(["membro", "administrador"]),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

const UsuariosAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      nome: "",
      email: "",
      classe: "membro",
    },
  });
  
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios
  });
  
  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    form.reset({
      nome: usuario.nome,
      email: usuario.email,
      classe: usuario.classe,
    });
    setIsEditDialogOpen(true);
  };
  
  const onSubmit = async (formData: UpdateUserFormValues) => {
    if (!selectedUsuario) return;
    
    try {
      setIsSubmitting(true);
      
      await updateUsuario(selectedUsuario.id, {
        nome: formData.nome,
        email: formData.email,
        classe: formData.classe,
      });
      
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao atualizar usuário: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    try {
      await deleteUsuario(id);
      
      toast.success("Usuário excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    } catch (error: any) {
      toast.error("Erro ao excluir usuário: " + error.message);
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <p className="text-gray-500 mt-1">Administre os usuários do sistema</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Gerencie as contas de usuários registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : usuarios && usuarios.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Data de Registro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.classe === 'administrador'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {usuario.classe}
                        </span>
                      </TableCell>
                      <TableCell>
                        {usuario.created_at 
                          ? new Date(usuario.created_at).toLocaleDateString() 
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(usuario)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(usuario.id)}
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
              Nenhum usuário encontrado.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="classe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="membro">Membro</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
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

export default UsuariosAdmin;
