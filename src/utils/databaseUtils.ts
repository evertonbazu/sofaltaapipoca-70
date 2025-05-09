import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log("Setting up database...");

    // Verificar se a tabela usuarios existe
    const { data: usuariosData, error: usuariosError } = await supabase.from('usuarios').select('id').limit(1);
    if (usuariosError && usuariosError.code !== '42P01') {
      throw usuariosError;
    }

    // Se a tabela usuarios não existir, criar
    if (!usuariosData || usuariosData.length === 0) {
      console.log('Tabela usuarios não existe. Criando...');
      const { error: createUsuariosError } = await supabase.rpc('create_usuarios_table_if_not_exists');
      if (createUsuariosError) throw createUsuariosError;
      console.log('Tabela usuarios criada com sucesso.');
    } else {
      console.log('Tabela usuarios já existe.');
    }

    // Verificar se a tabela anuncios existe
    const { data: anunciosData, error: anunciosError } = await supabase.from('anuncios').select('id').limit(1);
    if (anunciosError && anunciosError.code !== '42P01') {
      throw anunciosError;
    }

    // Se a tabela anuncios não existir, criar
    if (!anunciosData || anunciosData.length === 0) {
      console.log('Tabela anuncios não existe. Criando...');
      const { error: createAnunciosError } = await supabase.rpc('create_anuncios_table_if_not_exists');
      if (createAnunciosError) throw createAnunciosError;
      console.log('Tabela anuncios criada com sucesso.');
    } else {
      console.log('Tabela anuncios já existe.');
    }
  } catch (error) {
    console.error("Failed to set up database:", error);
    // Don't throw the error, just log it
  }
};
