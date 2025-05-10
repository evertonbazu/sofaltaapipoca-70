
import React from 'react';
import SubscriptionItem from './SubscriptionItem';
import { Anuncio } from '@/types/databaseTypes';

// Props que vêm do componente original
interface LegacySubscriptionProps {
  title: string;
  price: string;
  paymentMethod: string;
  status: string;
  access: string;
  headerColor: string;
  priceColor: string;
  whatsappNumber: string;
  telegramUsername: string;
  icon?: string;
  addedDate?: string;
  subscriptionRefs?: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

// Componente adaptador que converte props legados para o formato Anuncio
const SubscriptionCardAdapter: React.FC<LegacySubscriptionProps> = (props) => {
  // Converter props antigos para o formato de Anuncio
  const anuncio: Anuncio = {
    id: `legacy-${props.title}-${Math.random().toString(36).substring(7)}`,
    titulo: props.title,
    descricao: `${props.paymentMethod} - ${props.access}`,
    status: 'aprovado',
    usuario_id: 'legacy',
    valor: props.price,
    tipo_acesso: props.access,
    whatsapp: props.whatsappNumber,
    telegram: props.telegramUsername,
    codigo: props.icon || 'default'
  };

  return <SubscriptionItem anuncio={anuncio} />;
};

export default SubscriptionCardAdapter;
