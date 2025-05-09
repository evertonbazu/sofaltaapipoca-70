
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
