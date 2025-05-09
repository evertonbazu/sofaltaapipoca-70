
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
  status: 'pendente' | 'aprovado' | 'rejeitado';
  usuario_id: string;
  created_at?: string;
  // Adding relation for TypeScript to recognize nested queries
  usuarios?: Usuario;
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
