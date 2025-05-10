
import { Usuario, Anuncio, Contato } from '@/types/databaseTypes';

// Link da planilha para salvar, adicionar, editar e excluir os dados dos anúncios
// https://docs.google.com/spreadsheets/d/1qerXrEzFsxZQQdfWaHQr7Ga-uI3n5ymV2FTrwaZlwYk/edit?usp=sharing

// Banco de dados em memória para armazenar os dados da aplicação
// Em uma aplicação real, esses dados estariam armazenados em um banco de dados ou na planilha do Google
const localDB = {
  usuarios: [
    {
      id: "1",
      email: "evertonbazu@gmail.com",
      nome: "Everton Administrador",
      classe: "administrador" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      email: "usuario1@exemplo.com",
      nome: "João Silva",
      classe: "membro" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      email: "usuario2@exemplo.com",
      nome: "Maria Souza",
      classe: "membro" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      email: "usuario3@exemplo.com",
      nome: "Pedro Oliveira",
      classe: "membro" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "5",
      email: "usuario4@exemplo.com",
      nome: "Ana Santos",
      classe: "membro" as const,
      created_at: new Date().toISOString()
    }
  ] as Usuario[],
  
  anuncios: [
    {
      id: "1",
      codigo: "SF10001",
      titulo: "Netflix Premium",
      descricao: "Acesso completo a todas as séries e filmes do catálogo Netflix",
      imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop",
      status: "aprovado" as const,
      usuario_id: "2",
      created_at: new Date().toISOString(),
      valor: "R$ 15,00",
      quantidade_vagas: 3,
      tipo_envio: "login e senha" as const,
      telegram: "@joaosilva",
      whatsapp: "+5511987654321"
    },
    {
      id: "2",
      codigo: "SF10002",
      titulo: "Spotify Família",
      descricao: "Compartilhe sua conta Spotify com até 5 pessoas",
      imagem: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?q=80&w=1000&auto=format&fit=crop",
      status: "aprovado" as const,
      usuario_id: "3",
      created_at: new Date().toISOString(),
      valor: "R$ 10,00",
      quantidade_vagas: 4,
      tipo_envio: "convite" as const,
      telegram: "@mariasouza",
      whatsapp: "+5511912345678"
    },
    {
      id: "3",
      codigo: "SF10003",
      titulo: "Disney+ Compartilhado",
      descricao: "Acesso a filmes, séries e documentários da Disney, Marvel, Star Wars e National Geographic",
      imagem: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1000&auto=format&fit=crop",
      status: "pendente" as const,
      usuario_id: "2",
      created_at: new Date().toISOString(),
      valor: "R$ 12,00",
      quantidade_vagas: 2,
      tipo_envio: "login e senha" as const,
      whatsapp: "+5511987654321"
    },
    {
      id: "4",
      codigo: "SF10004",
      titulo: "Amazon Prime Vídeo",
      descricao: "Acesso a filmes, séries e conteúdo exclusivo da Amazon",
      imagem: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000&auto=format&fit=crop",
      status: "aprovado" as const,
      usuario_id: "4",
      created_at: new Date().toISOString(),
      valor: "R$ 9,00",
      quantidade_vagas: 3,
      tipo_envio: "ativação" as const,
      telegram: "@pedrooliveira",
      whatsapp: "+5511987654321"
    },
    {
      id: "5",
      codigo: "SF10005",
      titulo: "HBO Max Compartilhado",
      descricao: "Acesso às séries e filmes da HBO, DC, Warner e muito mais",
      imagem: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=1000&auto=format&fit=crop",
      status: "aprovado" as const,
      usuario_id: "5",
      created_at: new Date().toISOString(),
      valor: "R$ 11,50",
      quantidade_vagas: 2,
      tipo_envio: "login e senha" as const,
      telegram: "@anasantos",
      whatsapp: "+5511987654321"
    },
    {
      id: "6",
      codigo: "SF10006",
      titulo: "Apple TV+ Compartilhado",
      descricao: "Acesso a séries e filmes originais da Apple",
      imagem: "https://images.unsplash.com/photo-1580427331730-a29b4a914270?q=80&w=1000&auto=format&fit=crop",
      status: "aprovado" as const,
      usuario_id: "3",
      created_at: new Date().toISOString(),
      valor: "R$ 8,00",
      quantidade_vagas: 5,
      tipo_envio: "convite" as const,
      whatsapp: "+5511912345678"
    }
  ] as Anuncio[],
  
  contatos: [
    {
      id: "1",
      nome: "Carlos Eduardo",
      email: "carlos@exemplo.com",
      mensagem: "Gostaria de saber mais sobre o serviço de compartilhamento",
      status: "não lido" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      nome: "Ana Paula",
      email: "ana@exemplo.com",
      mensagem: "Estou com problemas para acessar minha conta",
      status: "lido" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      nome: "Roberto Alves",
      email: "roberto@exemplo.com",
      mensagem: "Como posso anunciar no site?",
      status: "não lido" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      nome: "Fernanda Lima",
      email: "fernanda@exemplo.com",
      mensagem: "Queria tirar uma dúvida sobre os pagamentos",
      status: "não lido" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "5",
      nome: "Gabriel Mendes",
      email: "gabriel@exemplo.com",
      mensagem: "Estou interessado em divulgar meu serviço no site",
      status: "lido" as const,
      created_at: new Date().toISOString()
    }
  ] as Contato[]
};

// Funções auxiliares para gerar IDs únicos
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Função para gerar código único para anúncios
const generateCode = () => {
  const prefix = 'SF';
  const lastAnuncio = localDB.anuncios.sort((a, b) => {
    const aNum = parseInt(a.codigo?.replace('SF', '') || '0');
    const bNum = parseInt(b.codigo?.replace('SF', '') || '0');
    return bNum - aNum;
  })[0];
  
  const lastNumber = lastAnuncio?.codigo ? parseInt(lastAnuncio.codigo.replace('SF', '')) : 10000;
  const nextNumber = lastNumber + 1;
  return `${prefix}${nextNumber}`;
};

// Função para enviar dados para o Google Sheets
const sendToGoogleSheets = async (data: any, sheetType: 'anuncios' | 'usuarios' | 'contatos') => {
  try {
    // Log showing we're sending data to Google Sheets
    console.log(`Enviando dados para Google Sheets (${sheetType}):`, data);
    console.log('Link da planilha: https://docs.google.com/spreadsheets/d/1qerXrEzFsxZQQdfWaHQr7Ga-uI3n5ymV2FTrwaZlwYk/edit?usp=sharing');
    
    // Em um ambiente de produção, aqui teríamos uma chamada real para a API do Google Sheets
    // Por enquanto, apenas simulamos o sucesso da operação
    return true;
  } catch (error) {
    console.error(`Erro ao enviar para Google Sheets (${sheetType}):`, error);
    return false;
  }
};

// Função para configurar o banco de dados
export const setupDatabase = async () => {
  console.log('Banco de dados local já configurado com dados de exemplo.');
  return true;
};

// Função para buscar usuários
export const fetchUsuarios = async () => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...localDB.usuarios];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para buscar anúncios
export const fetchAnuncios = async (status?: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...localDB.anuncios];
    
    if (status) {
      result = result.filter(anuncio => anuncio.status === status);
    }
    
    // Adicionando informações do usuário para cada anúncio
    return result.map(anuncio => {
      const usuario = localDB.usuarios.find(u => u.id === anuncio.usuario_id);
      return {
        ...anuncio,
        usuarios: usuario ? { nome: usuario.nome, email: usuario.email } : undefined
      };
    });
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    throw error;
  }
};

// Função para verificar se um usuário é administrador
export const isUserAdmin = (email: string) => {
  const usuario = localDB.usuarios.find(u => u.email === email);
  return usuario?.classe === 'administrador';
};

// Função para buscar um usuário por ID
export const fetchUsuarioById = async (id: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return localDB.usuarios.find(u => u.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
};

// Função para buscar um usuário por email
export const fetchUsuarioByEmail = async (email: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return localDB.usuarios.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    throw error;
  }
};

// Função para adicionar um novo usuário
export const addUsuario = async (usuario: Omit<Usuario, 'id' | 'created_at'>) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newUsuario: Usuario = {
      ...usuario,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    
    localDB.usuarios.push(newUsuario);
    
    // Enviar para Google Sheets
    await sendToGoogleSheets(newUsuario, 'usuarios');
    
    return newUsuario;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
};

// Função para atualizar um usuário
export const updateUsuario = async (id: string, data: Partial<Omit<Usuario, 'id'>>) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      localDB.usuarios[index] = {
        ...localDB.usuarios[index],
        ...data
      };
      
      // Enviar para Google Sheets
      await sendToGoogleSheets(localDB.usuarios[index], 'usuarios');
      
      return localDB.usuarios[index];
    }
    throw new Error('Usuário não encontrado');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Função para excluir um usuário
export const deleteUsuario = async (id: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      const deletedUser = localDB.usuarios[index];
      localDB.usuarios.splice(index, 1);
      
      // Log da operação para Google Sheets
      console.log(`Usuário excluído (id: ${id}) - Esta operação seria refletida na planilha Google Sheets`);
      
      return true;
    }
    throw new Error('Usuário não encontrado');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

// Função para adicionar um novo anúncio
export const addAnuncio = async (anuncio: Omit<Anuncio, 'id' | 'created_at'>) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newAnuncio: Anuncio = {
      ...anuncio,
      id: generateId(),
      created_at: new Date().toISOString(),
      codigo: anuncio.codigo || generateCode()
    };
    
    localDB.anuncios.push(newAnuncio);
    
    // Enviar para Google Sheets
    await sendToGoogleSheets(newAnuncio, 'anuncios');
    
    return newAnuncio;
  } catch (error) {
    console.error('Erro ao adicionar anúncio:', error);
    throw error;
  }
};

// Função para atualizar um anúncio
export const updateAnuncio = async (id: string, data: Partial<Omit<Anuncio, 'id'>>) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.anuncios.findIndex(a => a.id === id);
    if (index !== -1) {
      localDB.anuncios[index] = {
        ...localDB.anuncios[index],
        ...data
      };
      
      // Enviar para Google Sheets
      await sendToGoogleSheets(localDB.anuncios[index], 'anuncios');
      
      return localDB.anuncios[index];
    }
    throw new Error('Anúncio não encontrado');
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    throw error;
  }
};

// Função para excluir um anúncio
export const deleteAnuncio = async (id: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.anuncios.findIndex(a => a.id === id);
    if (index !== -1) {
      const deletedAnuncio = localDB.anuncios[index];
      localDB.anuncios.splice(index, 1);
      
      // Log da operação para Google Sheets
      console.log(`Anúncio excluído (id: ${id}) - Esta operação seria refletida na planilha Google Sheets`);
      
      return true;
    }
    throw new Error('Anúncio não encontrado');
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error);
    throw error;
  }
};

// Função para buscar mensagens de contato
export const fetchContatos = async () => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...localDB.contatos];
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }
};

// Função para adicionar uma nova mensagem de contato
export const addContato = async (contato: Omit<Contato, 'id' | 'created_at' | 'status'>) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newContato: Contato = {
      ...contato,
      id: generateId(),
      status: 'não lido',
      created_at: new Date().toISOString()
    };
    
    localDB.contatos.push(newContato);
    
    // Enviar para Google Sheets
    await sendToGoogleSheets(newContato, 'contatos');
    
    return newContato;
  } catch (error) {
    console.error('Erro ao adicionar contato:', error);
    throw error;
  }
};

// Função para atualizar o status de uma mensagem de contato
export const updateContatoStatus = async (id: string, status: 'lido' | 'não lido') => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.contatos.findIndex(c => c.id === id);
    if (index !== -1) {
      localDB.contatos[index].status = status;
      
      // Enviar para Google Sheets
      await sendToGoogleSheets(localDB.contatos[index], 'contatos');
      
      return localDB.contatos[index];
    }
    throw new Error('Mensagem de contato não encontrada');
  } catch (error) {
    console.error('Erro ao atualizar status do contato:', error);
    throw error;
  }
};

// Função para excluir uma mensagem de contato
export const deleteContato = async (id: string) => {
  try {
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = localDB.contatos.findIndex(c => c.id === id);
    if (index !== -1) {
      const deletedContato = localDB.contatos[index];
      localDB.contatos.splice(index, 1);
      
      // Log da operação para Google Sheets
      console.log(`Contato excluído (id: ${id}) - Esta operação seria refletida na planilha Google Sheets`);
      
      return true;
    }
    throw new Error('Mensagem de contato não encontrada');
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    throw error;
  }
};
