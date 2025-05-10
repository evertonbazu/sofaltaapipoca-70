
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/ui/navbar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { addAnuncio } from "@/utils/databaseUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Função para gerar código único
const gerarCodigo = () => {
  const prefixo = 'SF';
  const numero = Math.floor(10000 + Math.random() * 90000); // Número de 5 dígitos
  return `${prefixo}${numero}`;
};

const anuncioSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  valor: z.string().min(1, "Valor é obrigatório"),
  status: z.enum(["assinado", "em formação"], {
    required_error: "Selecione o status do anúncio",
  }),
  tipo_envio: z.enum(["login e senha", "ativação", "convite"], {
    required_error: "Selecione o tipo de envio",
  }),
  quantidade_vagas: z.coerce.number()
    .refine((val) => !isNaN(val) && val > 0, "Quantidade deve ser um número positivo"),
  telegram: z.string()
    .regex(/^@[a-zA-Z0-9_]{5,}$/, "Formato inválido. Use @username")
    .optional()
    .or(z.literal('')),
  whatsapp: z.string()
    .regex(/^\+\d{1,3}\d{9,}$/, "Formato inválido. Use +123456789012")
    .optional()
    .or(z.literal('')),
  imagem: z.string().optional(),
});

type AnuncioFormValues = z.infer<typeof anuncioSchema>;

const AnuncioFormPage = () => {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codigo] = useState(gerarCodigo());
  const [dataAtual] = useState(format(new Date(), 'yyyy-MM-dd'));
  const navigate = useNavigate();
  
  const form = useForm<AnuncioFormValues>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      valor: "",
      status: "em formação" as const,
      tipo_envio: "login e senha" as const,
      quantidade_vagas: 1,
      telegram: "",
      whatsapp: "",
      imagem: "",
    },
  });
  
  const onSubmit = async (data: AnuncioFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar um anúncio");
      navigate("/auth");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Formatação do valor para garantir o formato R$
      const valorFormatado = data.valor.startsWith('R$') 
        ? data.valor 
        : `R$ ${data.valor}`;
      
      // Preparar objeto para inserção no banco de dados
      await addAnuncio({
        titulo: data.titulo,
        descricao: data.descricao,
        valor: valorFormatado,
        quantidade_vagas: data.quantidade_vagas,
        status: userProfile?.classe === 'administrador' ? 'aprovado' : 'pendente',
        tipo_envio: data.tipo_envio,
        telegram: data.telegram || null,
        whatsapp: data.whatsapp || null,
        imagem: data.imagem || null,
        usuario_id: user.id,
        codigo: codigo,
        data_criacao: new Date().toISOString().split('T')[0],
      });
      
      toast.success(userProfile?.classe === 'administrador' 
        ? "Anúncio publicado com sucesso!" 
        : "Anúncio enviado com sucesso! Aguarde aprovação."
      );
      navigate("/");
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast.error("Erro ao enviar anúncio: " + (error.message || "Erro desconhecido"));
    } finally {
      setIsSubmitting(false);
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
                Você precisa estar logado para enviar um anúncio.
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Enviar Anúncio</h1>
            <p className="text-gray-600">Preencha o formulário para submeter seu anúncio para aprovação</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Anúncio</CardTitle>
              <CardDescription>
                Todos os campos marcados com * são obrigatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Código</p>
                      <Input 
                        value={codigo}
                        disabled
                        className="bg-gray-100 font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">Código gerado automaticamente</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Data</p>
                      <Input 
                        type="date" 
                        value={dataAtual}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Data atual preenchida automaticamente</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="valor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="R$ 0,00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quantidade_vagas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade de Vagas *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="assinado">Assinado</SelectItem>
                              <SelectItem value="em formação">Em formação</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tipo_envio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Envio *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de envio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="login e senha">Login e Senha</SelectItem>
                              <SelectItem value="ativação">Ativação</SelectItem>
                              <SelectItem value="convite">Convite</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telegram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="@username" />
                          </FormControl>
                          <FormDescription>Ex: @evertonbazu</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+5513996422303" />
                          </FormControl>
                          <FormDescription>Ex: +5513996422303</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="imagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link da Imagem</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://exemplo.com/imagem.jpg" />
                        </FormControl>
                        <FormDescription>URL da imagem para o anúncio (opcional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Anúncio"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnuncioFormPage;
