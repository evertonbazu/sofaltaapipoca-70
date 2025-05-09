
import { supabase } from "@/integrations/supabase/client";

// Função para criar a tabela de usuários se ela não existir
export const createUsuariosTableIfNotExists = async () => {
  try {
    const { error } = await supabase.rpc('create_usuarios_table_if_not_exists');
    
    if (error) {
      console.error('Erro ao verificar/criar tabela de usuários:', error);
      throw error;
    }
    
    console.log('Tabela de usuários verificada/criada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de usuários:', error);
    return false;
  }
};

// Função para criar a tabela de anúncios se ela não existir
export const createAnunciosTableIfNotExists = async () => {
  try {
    const { error } = await supabase.rpc('create_anuncios_table_if_not_exists');
    
    if (error) {
      console.error('Erro ao verificar/criar tabela de anúncios:', error);
      throw error;
    }
    
    console.log('Tabela de anúncios verificada/criada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de anúncios:', error);
    return false;
  }
};

// Função para criar a tabela de contatos se ela não existir
export const createContatoTableIfNotExists = async () => {
  try {
    const { error } = await supabase.rpc('create_contato_table_if_not_exists');
    
    if (error) {
      console.error('Erro ao verificar/criar tabela de contatos:', error);
      throw error;
    }
    
    console.log('Tabela de contatos verificada/criada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de contatos:', error);
    return false;
  }
};

// Função para verificar e criar todas as tabelas necessárias
export const setupDatabase = async () => {
  await createUsuariosTableIfNotExists();
  await createAnunciosTableIfNotExists();
  await createContatoTableIfNotExists();
};
