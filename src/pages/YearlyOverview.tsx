import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface ReportSection {
  key: string;
  name: string;
  description: string;
  versions: string[];
}

const YearlyOverview: React.FC = () => {
  const { id, year } = useParams<{ id: string; year: string }>();

  // Fetch report-metadata
  const {
    data: reportSections = [],
    isLoading: loadingReports,
    isError: errorReports
  } = useQuery<ReportSection[], Error>({
    queryKey: ['reportMetadata', id, year],
    queryFn: async () => {
      const res = await fetch(`/api/report-metadata/${id}/${year}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to load report metadata');
      const json = await res.json();
      return json.reports as ReportSection[];
    },
    enabled: Boolean(id && year)
  });

  if (loadingReports) {
    return <p>Chargement des rapports…</p>;
  }
  if (errorReports) {
    return <p>Erreur lors du chargement des rapports</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to="/etablissements" className="hover:text-earth-800">Établissements</Link>
            <span className="mx-2">›</span>
            <span>ETAB {id}</span>
            <span className="mx-2">›</span>
            <span>{year}</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            ETAB {id} – {year} Overview
          </h1>
          <p className="text-earth-600">
            Gestion des matrices et rapports pour l’établissement {id} en {year}.
          </p>
        </div>

        {/* Matrix Section (static link) */}
        <Card className="border-earth-200 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-forest-600 rounded" />
              <span>Matrice de Données</span>
            </CardTitle>
            <CardDescription>Accéder et gérer la matrice de données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="bg-forest-600 hover:bg-forest-700 flex-1"
              >
                <Link to={`/etablissement/${id}/${year}/matrix`}>
                  Accéder à la matrice
                </Link>
              </Button>
              <div className="text-sm text-earth-600 flex items-center">
                <span>4 lignes × 6 colonnes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Section (dynamic) */}
        <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-harvest-600 rounded" />
              <span>Gestion des Rapports</span>
            </CardTitle>
            <CardDescription>Choisissez un type et une version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {reportSections.map((section, i) => (
                <div
                  key={section.key}
                  className="border border-earth-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <h3 className="font-semibold text-earth-800 mb-2">{section.name}</h3>
                  <p className="text-sm text-earth-600 mb-4">{section.description}</p>
                  <div className="space-y-2">
                    {section.versions.map((ver) => (
                      <Button
                        key={ver}
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                      >
                        <Link to={`/etablissement/insert/${id}/${year}/${section.key}/${ver}`}>
                          {section.name} – {ver.toUpperCase()}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats (you can also make these dynamic later) */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-forest-700 mb-1">4×6</div>
              <div className="text-sm text-earth-600">Dimensions Matrice</div>
            </CardContent>
          </Card>
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-harvest-700">{reportSections.length}</div>
              <div className="text-sm text-earth-600">Types de Rapports</div>
            </CardContent>
          </Card>
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-earth-700">
                {reportSections.reduce((sum, s) => sum + s.versions.length, 0)}
              </div>
              <div className="text-sm text-earth-600">Total Versions</div>
            </CardContent>
          </Card>
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-forest-700">{year}</div>
              <div className="text-sm text-earth-600">Année Courante</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YearlyOverview;
