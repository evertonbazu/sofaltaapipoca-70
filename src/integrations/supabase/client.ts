
// Este arquivo mantém a interface do Supabase para compatibilidade com código existente
// mas agora está usando apenas o banco de dados em memória

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
    }
  },
  from: () => {
    return {
      select: () => {
        return {
          eq: () => {
            return { data: null, error: null };
          },
          single: () => {
            return { data: null, error: null };
          }
        };
      },
      insert: () => {
        return { data: null, error: null };
      },
      update: () => {
        return {
          eq: () => {
            return { data: null, error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: () => {
            return { data: null, error: null };
          }
        };
      }
    };
  },
  storage: {
    from: () => {
      return {
        upload: async () => {
          return { data: null, error: null };
        },
        getPublicUrl: () => {
          return { data: { publicUrl: '' } };
        }
      };
    }
  }
};

// Este é um cliente fictício que não faz nada, já que usaremos o banco de dados em memória
export const supabase = mockClient;
