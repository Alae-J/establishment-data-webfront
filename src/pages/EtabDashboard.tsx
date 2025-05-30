import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

interface EtabInfo {
  id: number;
  label: string;
  key: string;
}

const ROWS = ['AE', 'CE', 'IGF', 'CC'];
const COLS = ['IC', 'OB', 'REC', 'CA', 'DD', 'DA'];

const EtabDashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const etabCode = id ?? '';

  const {
    data: etabData,
    isLoading: loadingEtab
  } = useQuery<EtabInfo, Error>({
    queryKey: ['etab', etabCode],
    queryFn: async () => {
      const res = await fetch(`/api/etablissement/${etabCode}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Échec chargement établissement');
      const json = await res.json();
      return json.etablissement as EtabInfo;
    },
    enabled: Boolean(etabCode)
  });

  const {
    data: years = [],
    isLoading: loadingYears
  } = useQuery<number[], Error>({
    queryKey: ['years'],
    queryFn: async () => {
      const res = await fetch('/api/years', { credentials: 'include' });
      if (!res.ok) throw new Error('Échec chargement années');
      const json = await res.json();
      return json.years as number[];
    }
  });

  const {
    data: reportMetadata = [],
    isLoading: loadingReports
  } = useQuery({
    queryKey: ['report-types', etabData?.id],
    queryFn: async () => {
      const res = await fetch(`/api/report-metadata/${etabData?.id}/${Math.max(...years)}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Échec chargement rapports");
      const json = await res.json();
      return json.reports;
    },
    enabled: !!etabData && years.length > 0
  });

  if (authLoading) return <p>Vérification de la session…</p>;

  if (!user) return <Navigate to="/formlogin" replace />;
  if (!etabData) return <p>Erreur: Impossible de charger les données de l'établissement.</p>;

  if (user.role === 'establishment' && user.establishmentId !== etabData.id) {
    return <Navigate to="/" replace />;
  }

  if (loadingYears) return <p>Chargement des années…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Tableau de Bord – {etabData.label}
          </h1>
          <p className="text-earth-600">
            Bienvenue, {user.name}. Gérez les données et rapports de votre établissement.
          </p>
        </div>

        {/* Yearly Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {years.map((year, idx) => (
            <Card
              key={year}
              className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">{year}</CardTitle>
                <CardDescription>
                  Consulter toutes les données de {year}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                >
                  <Link to={`/etablissement/${etabCode}/${year}`}>
                    Vue d'ensemble
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Link to={`/etablissement/${etabCode}/${year}/matrix`}>
                    Données Matricielles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card
          className="border-earth-200 mt-8 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">
              Statistiques Rapides
            </CardTitle>
            <CardDescription>
              Vue d'ensemble des données de votre établissement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">
                  {years.length}
                </div>
                <div className="text-sm text-forest-600">Années actives</div>
              </div>
              <div className="p-4 bg-harvest-50 rounded-lg">
                <div className="text-2xl font-bold text-harvest-700">
                  {ROWS.length}
                </div>
                <div className="text-sm text-harvest-600">Lignes de matrice</div>
              </div>
              <div className="p-4 bg-earth-50 rounded-lg">
                <div className="text-2xl font-bold text-earth-700">
                  {COLS.length}
                </div>
                <div className="text-sm text-earth-600">
                  Colonnes de matrice
                </div>
              </div>
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">
                  {loadingReports ? "…" : reportMetadata.length}
                </div>
                <div className="text-sm text-forest-600">
                  Types de rapports
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EtabDashboard;
