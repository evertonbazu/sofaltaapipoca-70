
import React from 'react';
import { Anuncio } from "@/types/databaseTypes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";

interface SubscriptionItemProps {
  anuncio: Anuncio;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ anuncio }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden bg-gray-100">
        {anuncio.imagem ? (
          <img
            src={anuncio.imagem}
            alt={anuncio.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-3xl">📱</span>
          </div>
        )}
      </div>
      <CardContent className="flex-1 pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{anuncio.titulo}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            {anuncio.valor || "R$ 0,00"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {anuncio.descricao}
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Tipo de acesso:</span>
            <span className="font-medium">{anuncio.tipo_acesso || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Vagas:</span>
            <span className="font-medium">{anuncio.quantidade_vagas || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Código:</span>
            <span className="font-mono text-xs font-medium">{anuncio.codigo || "N/A"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 gap-2 flex">
        {anuncio.telegram && (
          <Button variant="outline" className="flex-1 gap-1" asChild>
            <a href={`https://t.me/${anuncio.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4" /> 
              Telegram
            </a>
          </Button>
        )}
        {anuncio.whatsapp && (
          <Button variant="outline" className="flex-1 gap-1" asChild>
            <a href={`https://wa.me/${anuncio.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4" /> 
              WhatsApp
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionItem;
