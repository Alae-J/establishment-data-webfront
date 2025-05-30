import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';

interface Establishment {
  key: string;    // from backend: the `code`
  label: string;  // from backend: the `name`
}

interface MetaEstab {
  id: number;
  key: string;
  title: string;
  description: string;
  image: string;
}

const META: MetaEstab[] = [
  {
    id: 1,
    key: 'ormvas',
    title: 'ORMVA – Offices Régionaux de Mise en Valeur Agricole',
    description: 'Organismes régionaux chargés de la gestion de l’eau et des ressources agricoles.',
    image: '/public/etabs/ormva-h.JPG',
  },
  {
    id: 2,
    key: 'agences',
    title: 'Agences de Développement',
    description: 'Agences spécialisées dans le développement agricole et rural.',
    image: '/public/etabs/agences.JPG',
  },
  {
    id: 3,
    key: 'offices',
    title: 'Offices Agricoles',
    description: 'Structures locales assurant des services agricoles et la coordination régionale.',
    image: '/public/etabs/offices.JPG',
  },
  {
    id: 4,
    key: 'formation',
    title: 'Centres de Formation',
    description: 'Institutions dédiées à la formation et à l’éducation agricoles.',
    image: '/public/etabs/etab-formation.png',
  },
  {
    id: 5,
    key: 'societe-etat',
    title: 'Sociétés d’État',
    description: 'Entreprises publiques opérant dans l’agriculture et l’industrie agroalimentaire.',
    image: '/public/etabs/se.JPG',
  },
];


const Etablissements: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/formlogin" replace />;

  const {
    data: fetched = [],
    isLoading,
    isError,
  } = useQuery<Establishment[], Error>({
    queryKey: ['establishments'],
    queryFn: async () => {
      const res = await fetch('/api/establishments', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      return json.establishments as Establishment[];
    },
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error loading establishments</p>;

  const list = fetched
    .map(e => {
      const m = META.find(m => m.key === e.key);
      if (!m) return null;
      return { ...m, label: e.label };
    })
    .filter((x): x is MetaEstab & { label: string } => x !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Établissements Agricoles
          </h1>
          <p className="text-earth-600">
            Découvrez les différents types d’établissements et d’organismes agricoles gérés par notre système.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((etab, index) => {
            const canView =
              user?.isAdmin ||
              (user?.role === 'establishment' && user.establishmentId === etab.id);

            return (
              <Card
                key={etab.key}
                className="border-earth-200 hover:shadow-lg transition-all duration-300 animate-fade-in group overflow-hidden bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={etab.image}
                    alt={`Image de ${etab.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader>
                  <CardTitle className="text-lg text-earth-800 group-hover:text-forest-700 transition-colors">
                    {etab.title}
                  </CardTitle>
                  <CardDescription className="text-earth-600">
                    {etab.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {canView ? (
                    <Button
                      asChild
                      className="w-full bg-forest-600 hover:bg-forest-700 transition-colors"
                    >
                      <Link to={`/etablissement/${etab.key}`}>Accéder</Link>
                    </Button>
                  ) : (
                    <div className="w-full py-2 px-4 bg-earth-100 text-earth-500 text-center rounded-md text-sm">
                      Accès restreint
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* À propos section stays unchanged */}
      </div>
    </div>
  );
};

export default Etablissements;
