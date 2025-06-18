
import CalendarSection from '@/components/CalendarSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-forest-50">
        <div className="animate-pulse text-slate-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-forest-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-forest-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/businessman-sitting-by-table-cafe.jpg")',
            backgroundPosition: 'center',
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
        
        {/* Institutional Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/50 to-forest-900/40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Ministry Logo Badge - Positioned at top */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 mb-8">
              <div className="flex flex-col items-center space-y-3">
                <img 
                  src="/lovable-uploads/46726841-3e64-43af-b036-a36c371e7ea7.png" 
                  alt="Ministère de l'Agriculture, de la Pêche Maritime, du Développement Rural et des Eaux et Forêts - Royaume du Maroc"
                  className="h-20 md:h-24 w-auto object-contain"
                />
                <div className="text-center">
                  <p className="text-sm md:text-base font-semibold text-slate-800 leading-tight">
                    Ministère de l'Agriculture, de la Pêche Maritime,
                  </p>
                  <p className="text-sm md:text-base font-semibold text-slate-800">
                    du Développement Rural et des Eaux et Forêts
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 font-medium">
                    Royaume du Maroc
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Main Title - Bold and Institutional */}
            <div className="mb-6">
              <h1 className="text-7xl md:text-8xl font-bold text-white mb-2 leading-none tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-forest-100 bg-clip-text text-transparent">
                  CapGouv
                </span>
              </h1>
              
              {/* Subtitle - Softer but clear */}
              <h2 className="text-2xl md:text-3xl font-medium text-blue-100/90 mb-8 tracking-wide">
                Cap vers la bonne Gouvernance publique
              </h2>
            </div>

            {/* Decorative Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-forest-400 to-blue-400 mx-auto rounded-full mb-10" />

            {/* Description with highlighted key phrase */}
            <div className="max-w-5xl mx-auto mb-12">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                <span className="inline-block px-4 py-1 bg-forest-500/20 text-forest-200 font-semibold rounded-lg border border-forest-300/30 backdrop-blur-sm mb-3">
                  Plateforme gouvernementale de référence
                </span>
                <br />
                dédiée à l'accompagnement des établissements publics sous tutelle du département de l'agriculture 
                pour la mise à niveau progressive des bonnes pratiques de gouvernance institutionnelle.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-forest-600 hover:bg-forest-700 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-forest-500"
              >
                <Link to="/formlogin">
                  Accéder au système
                  <span className="ml-3">→</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/60 text-white hover:bg-white/10 hover:border-white/80 px-10 py-4 text-lg font-semibold bg-white/10 backdrop-blur-md transition-all duration-300 hover:shadow-xl"
              >
                <Link to="/etablissements">
                  Explorer les établissements
                  <span className="ml-3">🏛️</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Solutions intégrées de gouvernance
            </h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Des outils modernes et sécurisés pour accompagner la transformation digitale 
              de vos pratiques administratives et organisationnelles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                color: 'forest',
                title: 'Gestion des Matrices',
                text: 'Suivez et gérez les matrices de données complètes de vos établissements avec mises à jour en temps réel et validations intégrées.',
                icon: '📊'
              },
              {
                color: 'blue',
                title: 'Gestion des Rapports',
                text: 'Téléversez, organisez et consultez les rapports PDF avec contrôle de version et sécurité documentaire.',
                icon: '📋'
              },
              {
                color: 'slate',
                title: 'Support Multi-Entités',
                text: 'Prise en charge de multiples établissements agricoles avec accès basé sur les rôles et tableaux de bord personnalisés.',
                icon: '🏛️'
              }
            ].map((feature, i) => (
              <Card
                key={feature.title}
                className="border-slate-200 hover:shadow-2xl transition-all duration-500 animate-fade-in group bg-white/95 backdrop-blur-sm hover:bg-white"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-forest-700 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Calendar Section */}
          <div className="animate-fade-in bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/40" style={{ animationDelay: '0.6s' }}>
            <CalendarSection />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-200/60 bg-gradient-to-r from-white/90 to-slate-50/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-32 h-1 bg-gradient-to-r from-forest-500 to-blue-500 mx-auto rounded-full mb-4" />
              <h4 className="text-lg font-semibold text-slate-700 mb-2">CapGouv</h4>
              <p className="text-sm text-slate-500">Cap vers la bonne Gouvernance publique</p>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              &copy; 2025 CapGouv - Département de l'Agriculture. Tous droits réservés.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
