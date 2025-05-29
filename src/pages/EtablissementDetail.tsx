import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

const EtablissementDetail = () => {
  const { user, isLoading } = useAuth();
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const years = [2022, 2023, 2024];
  const report = 'default';
  const version = 'v1';

  if (isLoading) return null;

  if (!user || !user.isAdmin) {
    return <Navigate to="/formlogin" replace />;
  }

  const establishmentInfo: Record<string, any> = {
    ormvas: {
      title: 'ORMVA - Offices Régionaux de Mise en Valeur Agricole',
      description: 'Les ORMVA sont des institutions clés du secteur agricole marocain, responsables de la gestion intégrée des ressources en eau et en sol dans leurs régions respectives.',
      features: [
        'Gestion des ressources en eau',
        'Programmes de conservation des sols',
        'Services de vulgarisation agricole',
        'Soutien et formation des agriculteurs',
        'Développement de systèmes d’irrigation'
      ],
      regions: [
        'ORMVA du Loukkos',
        'ORMVA du Gharb',
        'ORMVA de Doukkala',
        'ORMVA de Tafilalet',
        'ORMVA du Haouz'
      ]
    },
    agences: {
      title: 'Agences de Développement',
      description: 'Agences spécialisées dédiées à la promotion du développement agricole et rural à travers des programmes ciblés et des initiatives stratégiques.',
      features: [
        'Programmes de développement rural',
        'Modernisation agricole',
        'Transfert de technologies',
        'Développement des marchés',
        'Renforcement des capacités'
      ],
      regions: [
        'Agence Région Nord',
        'Agence Région Centre',
        'Agence Région Sud',
        'Agence Région Est'
      ]
    },
    offices: {
      title: 'Offices Agricoles',
      description: 'Bureaux agricoles locaux fournissant un appui direct aux agriculteurs et aux communautés rurales.',
      features: [
        'Soutien local aux agriculteurs',
        'Conseils agricoles',
        'Suivi des cultures',
        'Programmes de lutte contre les ravageurs',
        'Coordination des zones rurales'
      ],
      regions: [
        'Bureaux provinciaux',
        'Bureaux de districts',
        'Centres ruraux',
        'Points de vulgarisation'
      ]
    },
    formation: {
      title: 'Centres de Formation',
      description: 'Instituts éducatifs spécialisés dans la formation agricole, la recherche et le transfert de connaissances.',
      features: [
        'Programmes de formation professionnelle',
        'Recherche agricole',
        'Formation continue',
        'Démonstration de technologies',
        'Diffusion du savoir'
      ],
      regions: [
        'Écoles Nationales d’Agriculture',
        'Centres Régionaux de Formation',
        'Instituts Spécialisés',
        'Centres de recherche'
      ]
    },
    'societe-etat': {
      title: 'Sociétés d’État',
      description: 'Entreprises publiques opérant dans les secteurs de l’agriculture et de l’agroalimentaire.',
      features: [
        'Production agricole',
        'Transformation alimentaire',
        'Gestion de la chaîne logistique',
        'Stabilisation des marchés',
        'Constitution de réserves stratégiques'
      ],
      regions: [
        'Sociétés de production',
        'Unités de transformation',
        'Réseaux de distribution',
        'Centres de stockage'
      ]
    }
  };

  const info = establishmentInfo[name || ''] || {
    title: 'Établissement Inconnu',
    description: 'Aucune information disponible pour cet établissement.',
    features: [],
    regions: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to="/etablissements" className="hover:text-earth-800">Établissements</Link>
            <span className="mx-2">›</span>
            <span>{info.title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-4">{info.title}</h1>
          <p className="text-lg text-earth-600 max-w-4xl">{info.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Card className="border-earth-200 mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">Fonctionnalités & Services</CardTitle>
                <CardDescription>Fonctions clés et responsabilités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {info.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-forest-50 rounded-lg">
                      <div className="w-2 h-2 bg-forest-600 rounded-full"></div>
                      <span className="text-earth-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">Couverture Régionale</CardTitle>
                <CardDescription>Zones d’intervention et d’influence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {info.regions.map((region: string, index: number) => (
                    <div key={index} className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors">
                      <span className="text-earth-700 font-medium">{region}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="year-select" className="text-sm text-earth-700">Choisir une année</label>
                  <select
                    id="year-select"
                    className="w-full border border-earth-300 rounded px-3 py-2 text-earth-700"
                    value={selectedYear ?? ''}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    <option value="">-- Sélectionner une année --</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <Button
                  disabled={!selectedYear}
                  onClick={() => navigate(`/etablissement/insert/${name}/${selectedYear}/${report}/${version}`)}
                  className="w-full bg-forest-600 hover:bg-forest-700"
                >
                  Accéder au système
                </Button>
                <Button asChild variant="outline" className="w-full border-earth-300 text-earth-700 hover:bg-earth-50">
                  <Link to="/etablissements">Retour aux établissements</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">Informations Complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-earth-600">
                <div className="p-3 bg-harvest-50 rounded-lg">
                  <div className="font-medium text-harvest-800 mb-1">Gestion des Données</div>
                  <div>Suivi basé sur des matrices pour une analyse complète</div>
                </div>
                <div className="p-3 bg-forest-50 rounded-lg">
                  <div className="font-medium text-forest-800 mb-1">Rapports</div>
                  <div>Documents PDF avec gestion des versions</div>
                </div>
                <div className="p-3 bg-earth-50 rounded-lg">
                  <div className="font-medium text-earth-800 mb-1">Suivi Pluriannuel</div>
                  <div>Analyse des données historiques et suivi des tendances</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtablissementDetail;
