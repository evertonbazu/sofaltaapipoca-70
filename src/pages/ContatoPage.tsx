
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const contatoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

type ContatoFormValues = z.infer<typeof contatoSchema>;

const ContatoPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContatoFormValues>({
    resolver: zodResolver(contatoSchema),
    defaultValues: {
      nome: "",
      email: "",
      mensagem: "",
    },
  });
  
  const onSubmit = async (data: ContatoFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Verificar se a tabela existe antes de inserir
      const { error: checkError } = await supabase
        .from('contato')
        .select('id')
        .limit(1);
      
      // Se a tabela não existir, criar primeiro
      if (checkError && checkError.code === '42P01') {
        console.log('Tabela contato não existe. Criando...');
        const { error: createError } = await supabase
          .rpc('create_contato_table_if_not_exists');
        
        if (createError) throw createError;
      }
      
      // Inserir o contato
      const { error } = await supabase
        .from('contato')
        .insert([{
          nome: data.nome,
          email: data.email,
          mensagem: data.mensagem,
          status: 'não lido',
        }]);
      
      if (error) throw error;
      
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      form.reset();
    } catch (error: any) {
      toast.error("Erro ao enviar mensagem: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fale Conosco</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Voltar para o início
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Envie sua mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato o mais breve possível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Digite sua mensagem aqui..." 
                            rows={5}
                            {...field} 
                          />
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
                      "Enviar Mensagem"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Entre em contato por qualquer um destes meios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contato@empresa.com</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-semibold">Telefone</p>
                    <p className="text-gray-600">(11) 9999-9999</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-semibold">Endereço</p>
                    <p className="text-gray-600">
                      Av. Paulista, 1000<br />
                      São Paulo - SP<br />
                      01310-100
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-semibold">Horário de Atendimento</p>
                    <p className="text-gray-600">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 12h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContatoPage;
