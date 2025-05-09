
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
}

export interface Contato {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
  status: 'não lido' | 'lido';
  created_at?: string;
}
