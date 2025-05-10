
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  classe: 'membro' | 'administrador';
  created_at?: string;
}

export interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'assinado' | 'em formação';
  usuario_id: string;
  created_at?: string;
  valor?: string;
  quantidade_vagas?: number;
  tipo_acesso?: string;
  pix?: string;
  data_criacao?: string;
  codigo?: string;
  telegram?: string;
  whatsapp?: string;
  tipo_envio?: 'login e senha' | 'ativação' | 'convite';
  // Adding relation for TypeScript to recognize nested queries
  usuarios?: { nome: string; email: string; };
}

export interface Contato {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  status: 'não lido' | 'lido';
  created_at?: string;
}

// This is the type for non-null assertions
export type NonNullable<T> = T extends null | undefined ? never : T;
