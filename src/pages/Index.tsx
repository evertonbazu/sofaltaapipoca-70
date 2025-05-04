
import React, { useState, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import SubscriptionList from '@/components/SubscriptionList';
import NoResults from '@/components/NoResults';

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasResults, setHasResults] = useState(true);
  const subscriptionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-indigo text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">🍿 Só Falta a Pipoca</h1>
          <p className="text-center text-lg mt-2">Assinaturas premium com preços exclusivos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        
        {hasResults ? (
          <SubscriptionList 
            subscriptionRefs={subscriptionRefs} 
            searchTerm={searchTerm}
            setHasResults={setHasResults}
          />
        ) : (
          <NoResults />
        )}
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Só Falta a Pipoca. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
