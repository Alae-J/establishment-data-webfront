
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const YearlyOverview = () => {
  const { id, year } = useParams<{ id: string; year: string }>();

  const reportTypes = [
    { name: 'Financial Reports', key: 'financial', description: 'Budget and financial analysis documents' },
    { name: 'Performance Reports', key: 'performance', description: 'Operational performance metrics' },
    { name: 'Compliance Reports', key: 'compliance', description: 'Regulatory compliance documentation' },
    { name: 'Audit Reports', key: 'audit', description: 'Internal and external audit findings' },
  ];

  const versions = ['v1', 'v2', 'v3'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to="/etablissements" className="hover:text-earth-800">Establishments</Link>
            <span className="mx-2">›</span>
            <span>ETAB {id}</span>
            <span className="mx-2">›</span>
            <span>{year}</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            ETAB {id} - {year} Overview
          </h1>
          <p className="text-earth-600">
            Comprehensive data management and reporting for establishment {id} in {year}.
          </p>
        </div>

        {/* Matrix Data Section */}
        <Card className="border-earth-200 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-forest-600 rounded"></div>
              <span>Data Matrix</span>
            </CardTitle>
            <CardDescription>View and manage the comprehensive data matrix</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="bg-forest-600 hover:bg-forest-700 flex-1"
              >
                <Link to={`/etablissement/${id}/${year}/matrix`}>
                  Access Matrix Data
                </Link>
              </Button>
              <div className="text-sm text-earth-600 flex items-center">
                <span>4 rows × 6 columns of data entries</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-harvest-600 rounded"></div>
              <span>Report Management</span>
            </CardTitle>
            <CardDescription>Access and manage all report types and versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {reportTypes.map((reportType, index) => (
                <div 
                  key={reportType.key}
                  className="border border-earth-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <h3 className="font-semibold text-earth-800 mb-2">{reportType.name}</h3>
                  <p className="text-sm text-earth-600 mb-4">{reportType.description}</p>
                  
                  <div className="space-y-2">
                    {versions.map((version) => (
                      <Button
                        key={version}
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                      >
                        <Link to={`/etablissement/insert/${id}/${year}/${reportType.key}/${version}`}>
                          {reportType.name} - {version.toUpperCase()}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-forest-700 mb-1">24</div>
              <div className="text-sm text-earth-600">Matrix Entries</div>
            </CardContent>
          </Card>
          
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-harvest-700">{reportTypes.length}</div>
              <div className="text-sm text-earth-600">Report Types</div>
            </CardContent>
          </Card>
          
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-earth-700">{versions.length}</div>
              <div className="text-sm text-earth-600">Versions Each</div>
            </CardContent>
          </Card>
          
          <Card className="border-earth-200 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-forest-700">{year}</div>
              <div className="text-sm text-earth-600">Current Year</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YearlyOverview;
