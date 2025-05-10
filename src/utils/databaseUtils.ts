
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    // Verificar/criar tabela de usuários
    const { error: errorUsuarios } = await supabase.functions.invoke('create_tables', {
      body: { action: 'create_usuarios_table' }
    });
    if (errorUsuarios) console.error('Erro ao criar tabela de usuários:', errorUsuarios);

    // Verificar/criar tabela de anúncios
    const { error: errorAnuncios } = await supabase.functions.invoke('create_tables', {
      body: { action: 'create_anuncios_table' }
    });
    if (errorAnuncios) console.error('Erro ao criar tabela de anúncios:', errorAnuncios);

    // Verificar/criar tabela de contato
    const { error: errorContato } = await supabase.functions.invoke('create_tables', {
      body: { action: 'create_contato_table' }
    });
    if (errorContato) console.error('Erro ao criar tabela de contato:', errorContato);

    console.log('Configuração do banco de dados concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  }
};

// Função para buscar usuários (incluindo com verificação de admin)
export const fetchUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para buscar anúncios
export const fetchAnuncios = async (status?: string) => {
  try {
    let query = supabase
      .from('anuncios')
      .select('*, usuarios(nome, email)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    throw error;
  }
};
