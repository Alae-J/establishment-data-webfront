import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Etablissements = () => {
  const establishments = [
    {
      name: 'ormvas',
      title: 'ORMVA - Offices Régionaux de Mise en Valeur Agricole',
      description: 'Organismes régionaux chargés de la gestion de l’eau et des ressources agricoles.',
    },
    {
      name: 'agences',
      title: 'Agences de Développement',
      description: 'Agences spécialisées dans le développement agricole et rural.',
    },
    {
      name: 'offices',
      title: 'Offices Agricoles',
      description: 'Structures locales assurant des services agricoles et la coordination régionale.',
    },
    {
      name: 'formation',
      title: 'Centres de Formation',
      description: 'Institutions dédiées à la formation et à l’éducation agricoles.',
    },
    {
      name: 'societe-etat',
      title: 'Sociétés d’État',
      description: 'Entreprises publiques opérant dans l’agriculture et l’industrie agroalimentaire.',
    },
  ];

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
          {establishments.map((etablissement, index) => (
            <Card
              key={etablissement.name}
              className="border-earth-200 hover:shadow-lg transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-lg text-earth-800 group-hover:text-forest-700 transition-colors">
                  {etablissement.title}
                </CardTitle>
                <CardDescription className="text-earth-600">
                  {etablissement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-forest-600 hover:bg-forest-700 transition-colors"
                >
                  <Link to={`/etablissement/${etablissement.name}`}>
                    En savoir plus
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <Card className="border-earth-200 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">À propos de notre réseau</CardTitle>
            <CardDescription>Comprendre l’écosystème agricole</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-earth max-w-none">
              <p className="text-earth-700 leading-relaxed">
                Notre système de gestion agricole couvre un réseau étendu d’établissements répartis dans tout le Maroc,
                jouant chacun un rôle essentiel dans le développement agricole du pays.
                Des offices régionaux aux centres de formation spécialisés, ces structures œuvrent ensemble
                pour promouvoir une agriculture durable et garantir la sécurité alimentaire.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-earth-800 mb-2">Couverture Régionale</h4>
                  <p className="text-earth-600 text-sm">
                    Notre réseau s’étend sur toutes les grandes régions agricoles,
                    assurant un soutien localisé et une gestion adaptée aux besoins spécifiques.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-earth-800 mb-2">Gestion Intégrée</h4>
                  <p className="text-earth-600 text-sm">
                    Un système unifié de suivi et de gestion des données permet une coordination efficace
                    entre les différents établissements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Etablissements;
