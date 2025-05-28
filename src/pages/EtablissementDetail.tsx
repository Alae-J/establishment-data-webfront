
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const EtablissementDetail = () => {
  const { name } = useParams<{ name: string }>();

  const establishmentInfo: Record<string, any> = {
    ormvas: {
      title: 'ORMVA - Regional Offices for Agricultural Development',
      description: 'The Regional Offices for Agricultural Development are key institutions in Morocco\'s agricultural sector, responsible for integrated water and soil management in their respective regions.',
      features: [
        'Water resource management',
        'Soil conservation programs',
        'Agricultural extension services',
        'Farmer support and training',
        'Irrigation system development'
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
      title: 'Development Agencies',
      description: 'Specialized agencies dedicated to promoting agricultural and rural development through targeted programs and strategic initiatives.',
      features: [
        'Rural development programs',
        'Agricultural modernization',
        'Technology transfer',
        'Market development',
        'Capacity building'
      ],
      regions: [
        'Northern Region Agency',
        'Central Region Agency',
        'Southern Region Agency',
        'Eastern Region Agency'
      ]
    },
    offices: {
      title: 'Agricultural Offices',
      description: 'Local agricultural service offices providing direct support to farmers and rural communities.',
      features: [
        'Local farmer support',
        'Agricultural advisory services',
        'Crop monitoring',
        'Pest control programs',
        'Rural community coordination'
      ],
      regions: [
        'Provincial Offices',
        'District Offices',
        'Rural Centers',
        'Extension Points'
      ]
    },
    formation: {
      title: 'Training Centers',
      description: 'Educational institutions focused on agricultural training, research, and knowledge transfer.',
      features: [
        'Professional training programs',
        'Agricultural research',
        'Continuing education',
        'Technology demonstration',
        'Knowledge dissemination'
      ],
      regions: [
        'National Agricultural Schools',
        'Regional Training Centers',
        'Specialized Institutes',
        'Research Facilities'
      ]
    },
    'societe-etat': {
      title: 'State Companies',
      description: 'Government-owned companies operating in the agricultural and food industry sectors.',
      features: [
        'Agricultural production',
        'Food processing',
        'Supply chain management',
        'Market stabilization',
        'Strategic reserves'
      ],
      regions: [
        'Production Companies',
        'Processing Facilities',
        'Distribution Networks',
        'Storage Centers'
      ]
    }
  };

  const info = establishmentInfo[name || ''] || {
    title: 'Unknown Establishment',
    description: 'Information not available for this establishment.',
    features: [],
    regions: []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to="/etablissements" className="hover:text-earth-800">Establishments</Link>
            <span className="mx-2">›</span>
            <span>{info.title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-4">
            {info.title}
          </h1>
          <p className="text-lg text-earth-600 max-w-4xl">
            {info.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-earth-200 mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">Key Features & Services</CardTitle>
                <CardDescription>Core functions and responsibilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {info.features.map((feature: string, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-forest-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-forest-600 rounded-full"></div>
                      <span className="text-earth-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">Regional Coverage</CardTitle>
                <CardDescription>Areas of operation and influence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {info.regions.map((region: string, index: number) => (
                    <div 
                      key={index}
                      className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                    >
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
                <CardTitle className="text-lg text-earth-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-forest-600 hover:bg-forest-700">
                  <Link to="/formlogin">Access System</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-earth-300 text-earth-700 hover:bg-earth-50">
                  <Link to="/etablissements">View All Establishments</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-earth-600">
                <div className="p-3 bg-harvest-50 rounded-lg">
                  <div className="font-medium text-harvest-800 mb-1">Data Management</div>
                  <div>Matrix-based reporting system for comprehensive data tracking</div>
                </div>
                <div className="p-3 bg-forest-50 rounded-lg">
                  <div className="font-medium text-forest-800 mb-1">Report System</div>
                  <div>PDF-based documentation with version control</div>
                </div>
                <div className="p-3 bg-earth-50 rounded-lg">
                  <div className="font-medium text-earth-800 mb-1">Multi-Year Tracking</div>
                  <div>Historical data analysis and trend monitoring</div>
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
