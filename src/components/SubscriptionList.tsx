
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Anuncio } from "@/types/databaseTypes";
import SubscriptionItem from './SubscriptionItem';

interface SubscriptionListProps {
  subscriptionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  searchTerm: string;
  setHasResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptionRefs, searchTerm, setHasResults }) => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar anúncios
  const fetchAnuncios = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*, usuarios(nome, email)')
        .eq('status', 'aprovado');

      if (error) throw error;

      setAnuncios(data || []);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Erro ao buscar anúncios:', error.message);
      setIsLoading(false);
    }
  };

  // Carregar anúncios ao montar o componente
  useEffect(() => {
    fetchAnuncios();
  }, []);

  // Filtra os anúncios com base no termo de pesquisa
  const filteredAnuncios = anuncios.filter(anuncio => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      anuncio.titulo.toLowerCase().includes(searchTermLower) ||
      anuncio.descricao.toLowerCase().includes(searchTermLower) ||
      (anuncio.valor && anuncio.valor.toLowerCase().includes(searchTermLower)) ||
      (anuncio.tipo_acesso && anuncio.tipo_acesso.toLowerCase().includes(searchTermLower))
    );
  });

  // Atualiza o estado hasResults com base nos resultados filtrados
  useEffect(() => {
    setHasResults(filteredAnuncios.length > 0);
  }, [filteredAnuncios, setHasResults]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAnuncios.map((anuncio) => (
        <div key={anuncio.id} ref={el => (subscriptionRefs.current[anuncio.id] = el)}>
          <SubscriptionItem anuncio={anuncio} />
        </div>
      ))}
    </div>
  );
};

export default SubscriptionList;
