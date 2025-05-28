
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-50 to-forest-50">
        <div className="animate-pulse text-earth-600">Loading...</div>
      </div>
    );
  }

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    if (user.isAdmin) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to={`/etab/${user.name}`} replace />;
    }
  }

  // Public landing page for non-logged users
  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-600/20 to-forest-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-earth-800 mb-6">
              Agro Management System
            </h1>
            <p className="text-xl text-earth-600 mb-8 max-w-3xl mx-auto">
              Comprehensive agricultural establishment management platform for tracking, 
              reporting, and evaluating data across all your agricultural entities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-forest-600 hover:bg-forest-700">
                <Link to="/formlogin">Access System</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-earth-300 text-earth-700 hover:bg-earth-50">
                <Link to="/etablissements">View Establishments</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-forest-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-earth-800 mb-2">Matrix Management</h3>
              <p className="text-earth-600">
                Manage and track comprehensive data matrices for all your establishments 
                with real-time updates and validation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-harvest-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-harvest-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-earth-800 mb-2">Report Management</h3>
              <p className="text-earth-600">
                Upload, organize, and access PDF reports with version control 
                and secure document management.
              </p>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-earth-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-earth-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-earth-800 mb-2">Multi-Entity Support</h3>
              <p className="text-earth-600">
                Support for multiple agricultural establishments with 
                role-based access and customized dashboards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-earth-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-earth-600">
            <p>&copy; 2024 Agro Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
