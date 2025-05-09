
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log("Setting up database...");

    // Verificar se a tabela usuarios existe
    const { data: usuariosData, error: usuariosError } = await supabase.from('usuarios').select('id').limit(1);
    if (usuariosError) {
      console.error("Error checking usuarios table:", usuariosError);
      // Only throw if it's not a "relation does not exist" error
      if (usuariosError.code !== '42P01') {
        throw usuariosError;
      }
    }

    // Se a tabela usuarios não existir, criar
    if (!usuariosData || usuariosData.length === 0) {
      console.log('Tabela usuarios não existe ou está vazia. Criando/verificando...');
      const { error: createUsuariosError } = await supabase.rpc('create_usuarios_table_if_not_exists');
      if (createUsuariosError) {
        console.error("Error creating usuarios table:", createUsuariosError);
        // No need to throw since this is more of a helper function now
      } else {
        console.log('Função create_usuarios_table_if_not_exists executada com sucesso.');
      }
    } else {
      console.log('Tabela usuarios já existe.');
    }

    // Verificar se a tabela anuncios existe
    const { data: anunciosData, error: anunciosError } = await supabase.from('anuncios').select('id').limit(1);
    if (anunciosError) {
      console.error("Error checking anuncios table:", anunciosError);
      // Only throw if it's not a "relation does not exist" error
      if (anunciosError.code !== '42P01') {
        throw anunciosError;
      }
    }

    // Se a tabela anuncios não existir, criar
    if (!anunciosData || anunciosData.length === 0) {
      console.log('Tabela anuncios não existe ou está vazia. Criando/verificando...');
      const { error: createAnunciosError } = await supabase.rpc('create_anuncios_table_if_not_exists');
      if (createAnunciosError) {
        console.error("Error creating anuncios table:", createAnunciosError);
        // No need to throw since this is more of a helper function now
      } else {
        console.log('Função create_anuncios_table_if_not_exists executada com sucesso.');
      }
    } else {
      console.log('Tabela anuncios já existe.');
    }

    // Verificar se a tabela contato existe
    const { data: contatoData, error: contatoError } = await supabase.from('contato').select('id').limit(1);
    if (contatoError) {
      console.error("Error checking contato table:", contatoError);
      // Only throw if it's not a "relation does not exist" error
      if (contatoError.code !== '42P01') {
        throw contatoError;
      }
    }
    
    // Se a tabela contato não existir, criar
    if (!contatoData || contatoData.length === 0) {
      console.log('Tabela contato não existe ou está vazia. Criando/verificando...');
      const { error: createContatoError } = await supabase.rpc('create_contato_table_if_not_exists');
      if (createContatoError) {
        console.error("Error creating contato table:", createContatoError);
        // No need to throw since this is more of a helper function now
      } else {
        console.log('Função create_contato_table_if_not_exists executada com sucesso.');
      }
    } else {
      console.log('Tabela contato já existe.');
    }
    
    console.log("Database setup finished");
  } catch (error) {
    console.error("Failed to set up database:", error);
    // Don't throw the error, just log it
  }
};
