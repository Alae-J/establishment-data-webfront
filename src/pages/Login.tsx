import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect immediately if already logged in
  if (user) {
    return user.isAdmin
      ? <Navigate to="/admin" replace />
      : <Navigate to={`/etab/${user.establishmentId}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue sur la plateforme Agro Management",
        });
      } else {
        setError('Email ou mot de passe invalide. Veuillez réessayer.');
      }
    } catch {
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-earth-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <CardTitle className="text-2xl font-bold text-earth-800">
              Agro Management
            </CardTitle>
            <CardDescription className="text-earth-600">
              Connectez-vous pour accéder à votre tableau de bord agricole
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-earth-700">Adresse Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Entrez votre email"
                  required
                  className="border-earth-200 focus:border-forest-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-earth-700">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  className="border-earth-200 focus:border-forest-500"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-forest-600 hover:bg-forest-700"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-earth-600 hover:text-earth-800 transition-colors"
              >
                ← Retour à l’accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;