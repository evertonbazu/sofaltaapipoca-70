
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Usuario } from '@/types/databaseTypes';
import { fetchUsuarioByEmail, addUsuario, fetchUsuarioById } from '@/utils/databaseUtils';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  userProfile: Usuario | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Definindo uma interface local para o nosso usuário simulado 
// que é compatível com a interface User do Supabase
interface MockUser {
  id: string;
  email: string;
  app_metadata: Record<string, any>;
  user_metadata: { nome: string };
  aud: string;
  created_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const userData = await fetchUsuarioById(userId);
      
      if (!userData) {
        console.error('Perfil de usuário não encontrado');
        return;
      }

      setUserProfile(userData);
      setIsAdmin(userData.classe === 'administrador');
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  // Simula lógica de autenticação com o banco de dados em memória
  useEffect(() => {
    // Verificar se há um usuário no localStorage
    const savedUserData = localStorage.getItem('currentUser');
    
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        const mockSession = { user: userData, expires_at: 9999999999 };
        setSession(mockSession as Session);
        
        // Criar um usuário que seja compatível com a interface User do Supabase
        const mockUser: MockUser = {
          id: userData.id,
          email: userData.email,
          app_metadata: {},
          user_metadata: { nome: userData.user_metadata.nome },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        
        // Convertemos explicitamente para o tipo User
        setUser(mockUser as unknown as User);
        
        // Buscar o perfil do usuário
        fetchUserProfile(userData.id);
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se o usuário existe no banco de dados local
      const existingUser = await fetchUsuarioByEmail(email);
      
      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }
      
      // Criar um usuário que seja compatível com a interface User do Supabase
      const mockUser: MockUser = {
        id: existingUser.id,
        email: existingUser.email,
        app_metadata: {},
        user_metadata: { nome: existingUser.nome },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      
      // Salvar usuário no localStorage para persistência
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // Atualizar o estado
      setUser(mockUser as unknown as User);
      setUserProfile(existingUser);
      setIsAdmin(existingUser.classe === 'administrador');
      
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error('Erro ao fazer login: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se o usuário já existe
      const existingUser = await fetchUsuarioByEmail(email);
      
      if (existingUser) {
        throw new Error('Este email já está em uso');
      }
      
      // Adicionar o usuário ao banco de dados local
      await addUsuario({
        email,
        nome,
        classe: email === 'evertonbazu@gmail.com' ? 'administrador' : 'membro',
      });
      
      toast.success('Cadastro realizado com sucesso! Agora você pode fazer login.');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Erro ao criar conta: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Remover usuário do localStorage
      localStorage.removeItem('currentUser');
      
      // Limpar o estado
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);
      
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error('Erro ao fazer logout: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      isAdmin,
      userProfile,
      signIn, 
      signUp, 
      signOut,
      refreshUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
