
// Este arquivo mantém a interface do Supabase para compatibilidade com código existente
// mas agora está usando apenas o banco de dados em memória e integração com Google Sheets
// Link da planilha: https://docs.google.com/spreadsheets/d/1qerXrEzFsxZQQdfWaHQr7Ga-uI3n5ymV2FTrwaZlwYk/edit?usp=sharing

const mockClient = {
  auth: {
    signInWithPassword: async () => {
      return { error: null };
    },
    signUp: async () => {
      return { error: null, data: {} };
    },
    signOut: async () => {
      return { error: null };
    },
    getSession: async () => {
      return { data: { session: null } };
    },
    onAuthStateChange: () => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    updateUser: async () => {
      return { error: null };
    }
  },
  from: (table: string) => {
    return {
      select: (columns?: string) => {
        return {
          eq: (column: string, value: any) => {
            return { 
              single: () => {
                return { data: null, error: null }; 
              },
              limit: (limit: number) => {
                return { 
                  order: (column: string, options: any) => {
                    return { data: null, error: null };
                  },
                  data: null, 
                  error: null 
                };
              },
              data: null, 
              error: null 
            };
          },
          single: () => {
            return { data: null, error: null };
          },
          limit: (limit: number) => {
            return { 
              order: (column: string, options: any) => {
                return { data: null, error: null };
              },
              data: null, 
              error: null 
            };
          },
          order: (column: string, options: any) => {
            return { data: null, error: null };
          },
          data: null, error: null
        };
      },
      insert: (data: any) => {
        return { data: null, error: null };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            return { data: null, error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return { data: null, error: null };
          }
        };
      }
    };
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: any) => {
          return { data: null, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: '' } };
        }
      };
    }
  },
  rpc: (func: string, params?: any) => {
    return { data: null, error: null };
  }
};

// Este é um cliente fictício que não faz nada, já que usaremos o banco de dados em memória
// Os dados são salvos localmente e simulam a persistência. Em um ambiente de produção,
// essas operações seriam feitas em um banco de dados real ou na planilha do Google.
export const supabase = mockClient;
