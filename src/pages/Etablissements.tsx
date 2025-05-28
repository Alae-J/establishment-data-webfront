
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Etablissements = () => {
  const establishments = [
    { name: 'ormvas', title: 'ORMVA - Regional Offices for Agricultural Development', description: 'Regional agricultural development offices managing water and soil resources.' },
    { name: 'agences', title: 'Development Agencies', description: 'Specialized agencies for agricultural and rural development.' },
    { name: 'offices', title: 'Agricultural Offices', description: 'Local agricultural service offices and coordination centers.' },
    { name: 'formation', title: 'Training Centers', description: 'Agricultural education and professional training institutions.' },
    { name: 'societe-etat', title: 'State Companies', description: 'Government-owned agricultural and food industry companies.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Agricultural Establishments
          </h1>
          <p className="text-earth-600">
            Explore the various types of agricultural establishments and entities managed by our system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment, index) => (
            <Card 
              key={establishment.name}
              className="border-earth-200 hover:shadow-lg transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-lg text-earth-800 group-hover:text-forest-700 transition-colors">
                  {establishment.title}
                </CardTitle>
                <CardDescription className="text-earth-600">
                  {establishment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className="w-full bg-forest-600 hover:bg-forest-700 transition-colors"
                >
                  <Link to={`/etablissement/${establishment.name}`}>
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <Card className="border-earth-200 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">About Our Network</CardTitle>
            <CardDescription>Understanding the agricultural ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-earth max-w-none">
              <p className="text-earth-700 leading-relaxed">
                Our agricultural management system oversees a comprehensive network of establishments 
                across Morocco, each playing a vital role in the country's agricultural development. 
                From regional development offices to specialized training centers, these entities work 
                together to ensure sustainable agricultural practices and food security.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-earth-800 mb-2">Regional Coverage</h4>
                  <p className="text-earth-600 text-sm">
                    Our network spans all major agricultural regions, providing localized 
                    support and management for diverse agricultural needs.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-earth-800 mb-2">Integrated Management</h4>
                  <p className="text-earth-600 text-sm">
                    Unified reporting and data management systems ensure coordination 
                    and efficiency across all establishments.
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
