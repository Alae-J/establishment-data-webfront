import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: establishmentKeys = [], isLoading: loadingE } = useQuery({
    queryKey: ["establishments"],
    queryFn: () =>
      fetch("/api/establishments", { credentials: "include" })
        .then((r) => r.json())
        .then((j) => j.establishments),
  });

  const { data: years = [], isLoading: loadingY } = useQuery({
    queryKey: ["years"],
    queryFn: () =>
      fetch("/api/years", { credentials: "include" })
        .then((r) => r.json())
        .then((j) => j.years),
  });

  if (!user?.isAdmin) return <Navigate to="/" replace />;
  if (loadingE || loadingY) return <p>Chargement…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-earth-600">
            Bienvenue, {user.name}. Gérez l’ensemble des établissements agricoles et des rapports.
          </p>
        </div>

        {/* Actions rapides */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Établissements</CardTitle>
              <CardDescription>Afficher et gérer tous les établissements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-forest-600 hover:bg-forest-700">
                <Link to="/etablissements">Voir tous les établissements</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Statistiques Système</CardTitle>
              <CardDescription>Afficher les analyses globales du système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-earth-600">
                <div>Types d’établissements : {establishmentKeys.length}</div>
                <div>Années actives : {years.length}</div>
                <div>Types de rapports : Multiples</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grille des établissements */}
        <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Accès Rapide - Établissements</CardTitle>
            <CardDescription>Cliquez sur un établissement pour gérer ses données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {establishmentKeys.map(({ key, label }) => (
                <Button
                  key={key}
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-earth-300 text-earth-700 hover:bg-earth-100"
                >
                  <Link to={`/etablissement/${key}`}>{label}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="border-earth-200 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Activité Récente</CardTitle>
            <CardDescription>Dernières mises à jour dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-earth-600">
              <div className="flex justify-between items-center py-2 border-b border-earth-100">
                <span>Matrice mise à jour pour ETAB 1 - 2024</span>
                <span className="text-xs">il y a 2 heures</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-earth-100">
                <span>Nouveau rapport ajouté pour ETAB 5 - 2024</span>
                <span className="text-xs">il y a 4 heures</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Connexion utilisateur : ETAB 12</span>
                <span className="text-xs">il y a 6 heures</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
