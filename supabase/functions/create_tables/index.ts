
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter supabaseClient a partir do request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Criar o cliente do Supabase com o auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verificar a função solicitada
    const { action } = await req.json();

    let result;
    if (action === 'create_usuarios_table') {
      result = await createUsuariosTable(supabaseClient);
    } else if (action === 'create_anuncios_table') {
      result = await createAnunciosTable(supabaseClient);
    } else if (action === 'create_contato_table') {
      result = await createContatoTable(supabaseClient);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Função para criar tabela de usuários
async function createUsuariosTable(supabase) {
  const { data, error } = await supabase.rpc('create_usuarios_table_if_not_exists');

  if (error) throw error;
  
  return { success: true, data };
}

// Função para criar tabela de anúncios
async function createAnunciosTable(supabase) {
  const { data, error } = await supabase.rpc('create_anuncios_table_if_not_exists');

  if (error) throw error;
  
  return { success: true, data };
}

// Função para criar tabela de contato
async function createContatoTable(supabase) {
  const { data, error } = await supabase.rpc('create_contato_table_if_not_exists');

  if (error) throw error;
  
  return { success: true, data };
}
