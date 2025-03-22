import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <img 
        src="/asset/rre.png"  
        alt="Erreur 404"
        className="w-72 mb-6" 
        
      />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page non trouvée</p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
