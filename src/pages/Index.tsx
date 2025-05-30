import CalendarSection from '@/components/CalendarSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-50 to-forest-50">
        <div className="animate-pulse text-earth-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 via-forest-50 to-harvest-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-forest-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-harvest-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-earth-200/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: 'url("/businessman-sitting-by-table-cafe.jpg")'
        }}
      ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-earth-800 via-forest-700 to-harvest-600 mb-4 leading-tight">
              Système de Gestion
            </h1>
            <h2 className="text-4xl md:text-5xl font-semibold text-earth-700 mb-6">
              Agricole
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-forest-500 to-harvest-500 mx-auto rounded-full"></div>

            <p className="text-xl md:text-2xl text-earth-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Plateforme complète de gestion des établissements agricoles pour suivre, 
              analyser et organiser les données à travers toutes vos entités.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/formlogin">
                  Accéder au système
                  <span className="ml-2">→</span>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-earth-300 text-earth-700 hover:bg-earth-50 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/60 hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
              >
                <Link to="/etablissements">
                  Voir les établissements
                  <span className="ml-2">🌱</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités + Calendrier */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                color: 'forest',
                title: 'Gestion des Matrices',
                text: 'Suivez et gérez les matrices de données complètes de vos établissements avec mises à jour en temps réel et validations intégrées.'
              },
              {
                color: 'harvest',
                title: 'Gestion des Rapports',
                text: 'Téléversez, organisez et consultez les rapports PDF avec contrôle de version et sécurité documentaire.'
              },
              {
                color: 'earth',
                title: 'Support Multi-Entités',
                text: 'Prise en charge de multiples établissements agricoles avec accès basé sur les rôles et tableaux de bord personnalisés.'
              }
            ].map((feature, i) => (
              <Card
                key={feature.title}
                className={`border-earth-200 hover:shadow-2xl transition-all duration-500 animate-fade-in group bg-white/90 backdrop-blur-sm hover:bg-white/95`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 bg-gradient-to-br from-${feature.color}-600 to-${feature.color}-700 rounded-lg shadow-md`}></div>
                  </div>
                  <h3 className="text-xl font-bold text-earth-800 mb-4 group-hover:text-forest-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-earth-600 leading-relaxed">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Calendrier */}
          <div className="animate-fade-in bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20" style={{ animationDelay: '0.6s' }}>
            <CalendarSection />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-earth-200/50 bg-gradient-to-r from-white/80 to-earth-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-forest-500 to-harvest-500 mx-auto rounded-full mb-4"></div>
              <h3 className="text-lg font-semibold text-earth-700 mb-2">Système de Gestion Agricole</h3>
            </div>
            <p className="text-earth-600 text-sm">
              &copy; 2024 Système de Gestion Agricole. Tous droits réservés.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <div className="w-2 h-2 bg-forest-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-harvest-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-earth-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
