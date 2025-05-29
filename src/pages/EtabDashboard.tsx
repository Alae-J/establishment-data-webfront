import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link, Navigate, useParams } from 'react-router-dom';

const EtabDashboard = () => {
  const { user } = useAuth();
  const { name } = useParams<{ name: string }>();

  if (!user || user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Extraction de l'ID de l'établissement (ex: "etab_9" -> 9)
  const etabId = name?.replace('etab_', '') || '';
  const years = [2022, 2023, 2024];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Tableau de Bord - {name?.toUpperCase()}
          </h1>
          <p className="text-earth-600">
            Bienvenue, {user.name}. Gérez les données et rapports de votre établissement.
          </p>
        </div>

        {/* Actions rapides */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Matrice de Données</CardTitle>
              <CardDescription>Consultez et mettez à jour les données matricielles de votre établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {years.map((year) => (
                  <Button 
                    key={year}
                    asChild 
                    variant="outline" 
                    className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                  >
                    <Link to={`/etablissement/${etabId}/${year}/matrix`}>
                      Matrice {year}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Rapports</CardTitle>
              <CardDescription>Accédez aux rapports de votre établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-forest-600 hover:bg-forest-700">
                <Link to="/reports">Voir mes rapports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cartes par année */}
        <div className="grid md:grid-cols-3 gap-6">
          {years.map((year, index) => (
            <Card 
              key={year} 
              className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">{year}</CardTitle>
                <CardDescription>Consulter toutes les données de {year}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                >
                  <Link to={`/etablissement/${etabId}/${year}`}>
                    Vue d'ensemble
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Link to={`/etablissement/${etabId}/${year}/matrix`}>
                    Données Matricielles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistiques rapides */}
        <Card className="border-earth-200 mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Statistiques Rapides</CardTitle>
            <CardDescription>Vue d'ensemble des données de votre établissement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">{years.length}</div>
                <div className="text-sm text-forest-600">Années actives</div>
              </div>
              <div className="p-4 bg-harvest-50 rounded-lg">
                <div className="text-2xl font-bold text-harvest-700">4</div>
                <div className="text-sm text-harvest-600">Lignes de matrice</div>
              </div>
              <div className="p-4 bg-earth-50 rounded-lg">
                <div className="text-2xl font-bold text-earth-700">6</div>
                <div className="text-sm text-earth-600">Colonnes de matrice</div>
              </div>
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">Multiples</div>
                <div className="text-sm text-forest-600">Types de rapports</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EtabDashboard;
