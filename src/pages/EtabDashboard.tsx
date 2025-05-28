
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const EtabDashboard = () => {
  const { user } = useAuth();
  const { name } = useParams<{ name: string }>();

  if (!user || user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Extract establishment ID from name (e.g., "etab_9" -> 9)
  const etabId = name?.replace('etab_', '') || '';
  const years = [2022, 2023, 2024];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Establishment Dashboard - {name?.toUpperCase()}
          </h1>
          <p className="text-earth-600">
            Welcome, {user.name}. Manage your establishment's data and reports.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Data Matrix</CardTitle>
              <CardDescription>View and update your establishment's matrix data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {years.map((year) => (
                  <Button 
                    key={year}
                    asChild 
                    variant="outline" 
                    className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                  >
                    <Link to={`/etablissement/${etabId}/${year}/matrix`}>
                      Matrix {year}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Reports</CardTitle>
              <CardDescription>Access and upload reports for your establishment</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-forest-600 hover:bg-forest-700">
                <Link to="/reports">View My Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Year Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {years.map((year, index) => (
            <Card 
              key={year} 
              className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">{year}</CardTitle>
                <CardDescription>View all data for {year}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                >
                  <Link to={`/etablissement/${etabId}/${year}`}>
                    Overview
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Link to={`/etablissement/${etabId}/${year}/matrix`}>
                    Matrix Data
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="border-earth-200 mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Quick Statistics</CardTitle>
            <CardDescription>Overview of your establishment's data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">{years.length}</div>
                <div className="text-sm text-forest-600">Active Years</div>
              </div>
              <div className="p-4 bg-harvest-50 rounded-lg">
                <div className="text-2xl font-bold text-harvest-700">4</div>
                <div className="text-sm text-harvest-600">Matrix Rows</div>
              </div>
              <div className="p-4 bg-earth-50 rounded-lg">
                <div className="text-2xl font-bold text-earth-700">6</div>
                <div className="text-sm text-earth-600">Matrix Columns</div>
              </div>
              <div className="p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-700">Multiple</div>
                <div className="text-sm text-forest-600">Report Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EtabDashboard;
