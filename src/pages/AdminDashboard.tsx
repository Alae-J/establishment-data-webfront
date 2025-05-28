
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const establishmentIds = Array.from({ length: 26 }, (_, i) => i + 1);
  const years = [2022, 2023, 2024];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-earth-600">
            Welcome, {user.name}. Manage all agricultural establishments and reports.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Establishments</CardTitle>
              <CardDescription>View and manage all establishments</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-forest-600 hover:bg-forest-700">
                <Link to="/etablissements">View All Establishments</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Reports Overview</CardTitle>
              <CardDescription>Access reports across all entities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-earth-300 text-earth-700 hover:bg-earth-50">
                <Link to="/reports">View Reports</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-earth-200 hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">System Statistics</CardTitle>
              <CardDescription>View system-wide analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-earth-600">
                <div>Total Establishments: {establishmentIds.length}</div>
                <div>Active Years: {years.length}</div>
                <div>Report Types: Multiple</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Establishments Grid */}
        <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Quick Access - Establishments</CardTitle>
            <CardDescription>Click on any establishment to manage its data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {establishmentIds.map((id) => (
                <Button
                  key={id}
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-earth-300 text-earth-700 hover:bg-earth-100"
                >
                  <Link to={`/etablissement/etab_${id}`}>
                    ETAB {id}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-earth-200 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Recent Activity</CardTitle>
            <CardDescription>Latest updates across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-earth-600">
              <div className="flex justify-between items-center py-2 border-b border-earth-100">
                <span>Matrix data updated for ETAB 1 - 2024</span>
                <span className="text-xs">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-earth-100">
                <span>New report uploaded for ETAB 5 - 2024</span>
                <span className="text-xs">4 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>User login: ETAB 12</span>
                <span className="text-xs">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
