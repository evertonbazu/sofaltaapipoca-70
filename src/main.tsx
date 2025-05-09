
import { createRoot } from 'react-dom/client';
import React from 'react'; // Make sure React is explicitly imported
import App from './App.tsx';
import './index.css';
import { setupDatabase } from './utils/databaseUtils';

// Verificar/criar tabelas do banco de dados
setupDatabase().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
