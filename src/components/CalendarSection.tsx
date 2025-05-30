import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileCheck, ShoppingCart, Users } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'conseil' | 'audit-financier' | 'audit-marches';
  etablissement?: string;
}

const CalendarSection = () => {
  // Hardcoded example events
  const events: CalendarEvent[] = [
    // ORMVA Loukkos
    { id: '1', title: "Conseil d'administration - ORMVA Loukkos (Session 1)", date: new Date(2024, 11, 15), type: 'conseil', etablissement: 'ORMVA Loukkos' },
    { id: '2', title: "Conseil d'administration - ORMVA Loukkos (Session 2)", date: new Date(2025, 2, 10), type: 'conseil', etablissement: 'ORMVA Loukkos' },
    { id: '3', title: 'Audit Financier - ORMVA Loukkos', date: new Date(2025, 0, 7), type: 'audit-financier', etablissement: 'ORMVA Loukkos' },
  
    // ONCA
    { id: '4', title: "Conseil d'administration - ONCA (Session 1)", date: new Date(2024, 11, 16), type: 'conseil', etablissement: 'ONCA' },
    { id: '5', title: "Conseil d'administration - ONCA (Session 2)", date: new Date(2025, 3, 12), type: 'conseil', etablissement: 'ONCA' },
    { id: '6', title: 'Audit Marches - ONCA', date: new Date(2025, 1, 9), type: 'audit-marches', etablissement: 'ONCA' },
  
    // ADA
    { id: '7', title: "Conseil d'administration - ADA (Session 1)", date: new Date(2024, 11, 17), type: 'conseil', etablissement: 'ADA' },
    { id: '8', title: "Conseil d'administration - ADA (Session 2)", date: new Date(2025, 4, 12), type: 'conseil', etablissement: 'ADA' },
    { id: '9', title: 'Audit Financier - ADA', date: new Date(2025, 2, 11), type: 'audit-financier', etablissement: 'ADA' },
  
    // INRA
    { id: '10', title: "Conseil d'administration - INRA (Session 1)", date: new Date(2024, 11, 18), type: 'conseil', etablissement: 'INRA' },
    { id: '11', title: "Conseil d'administration - INRA (Session 2)", date: new Date(2025, 2, 20), type: 'conseil', etablissement: 'INRA' },
    { id: '12', title: 'Audit Marches - INRA', date: new Date(2025, 3, 13), type: 'audit-marches', etablissement: 'INRA' },
  
    // ORMVA Gharb
    { id: '13', title: "Conseil d'administration - ORMVA Gharb (Session 1)", date: new Date(2024, 11, 19), type: 'conseil', etablissement: 'ORMVA Gharb' },
    { id: '14', title: "Conseil d'administration - ORMVA Gharb (Session 2)", date: new Date(2025, 4, 15), type: 'conseil', etablissement: 'ORMVA Gharb' },
    { id: '15', title: 'Audit Financier - ORMVA Gharb', date: new Date(2025, 4, 5), type: 'audit-financier', etablissement: 'ORMVA Gharb' },
  
    // ENAM
    { id: '16', title: "Conseil d'administration - ENAM (Session 1)", date: new Date(2024, 11, 20), type: 'conseil', etablissement: 'ENAM' },
    { id: '17', title: "Conseil d'administration - ENAM (Session 2)", date: new Date(2025, 3, 28), type: 'conseil', etablissement: 'ENAM' },
    { id: '18', title: 'Audit Marches - ENAM', date: new Date(2025, 5, 9), type: 'audit-marches', etablissement: 'ENAM' },
  
    // IAV Hassan II
    { id: '19', title: "Conseil d'administration - IAV Hassan II (Session 1)", date: new Date(2024, 11, 21), type: 'conseil', etablissement: 'IAV Hassan II' },
    { id: '20', title: "Conseil d'administration - IAV Hassan II (Session 2)", date: new Date(2025, 2, 17), type: 'conseil', etablissement: 'IAV Hassan II' },
    { id: '21', title: 'Audit Financier - IAV Hassan II', date: new Date(2025, 6, 4), type: 'audit-financier', etablissement: 'IAV Hassan II' },
  
    // ONSSA
    { id: '22', title: "Conseil d'administration - ONSSA (Session 1)", date: new Date(2024, 11, 22), type: 'conseil', etablissement: 'ONSSA' },
    { id: '23', title: "Conseil d'administration - ONSSA (Session 2)", date: new Date(2025, 4, 10), type: 'conseil', etablissement: 'ONSSA' },
    { id: '24', title: 'Audit Marches - ONSSA', date: new Date(2025, 7, 12), type: 'audit-marches', etablissement: 'ONSSA' },
  
    // ORMVA Haouz
    { id: '25', title: "Conseil d'administration - ORMVA Haouz (Session 1)", date: new Date(2024, 11, 23), type: 'conseil', etablissement: 'ORMVA Haouz' },
    { id: '26', title: "Conseil d'administration - ORMVA Haouz (Session 2)", date: new Date(2025, 2, 25), type: 'conseil', etablissement: 'ORMVA Haouz' },
    { id: '27', title: 'Audit Financier - ORMVA Haouz', date: new Date(2025, 8, 7), type: 'audit-financier', etablissement: 'ORMVA Haouz' },
  
    // ORMVA Tafilalet
    { id: '28', title: "Conseil d'administration - ORMVA Tafilalet (Session 1)", date: new Date(2024, 11, 24), type: 'conseil', etablissement: 'ORMVA Tafilalet' },
    { id: '29', title: "Conseil d'administration - ORMVA Tafilalet (Session 2)", date: new Date(2025, 4, 18), type: 'conseil', etablissement: 'ORMVA Tafilalet' },
    { id: '30', title: 'Audit Marches - ORMVA Tafilalet', date: new Date(2025, 9, 3), type: 'audit-marches', etablissement: 'ORMVA Tafilalet' }
  ];
  

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'conseil':
        return <Users className="w-4 h-4" />;
      case 'audit-financier':
        return <FileCheck className="w-4 h-4" />;
      case 'audit-marches':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'conseil':
        return 'bg-forest-100 text-forest-800 border-forest-200';
      case 'audit-financier':
        return 'bg-harvest-100 text-harvest-800 border-harvest-200';
      case 'audit-marches':
        return 'bg-earth-100 text-earth-800 border-earth-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Group events by month for better organization
  const groupedEvents = events.reduce((acc, event) => {
    const monthKey = event.date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort events within each month
  const sortedMonths = Object.entries(groupedEvents).sort(([monthA, eventsA], [monthB, eventsB]) => {
    const dateA = eventsA[0].date;
    const dateB = eventsB[0].date;
    return dateA.getTime() - dateB.getTime();
  });
  

  return (
    <Card className="border-earth-200 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-earth-800">
          <Calendar className="w-5 h-5 text-forest-600" />
          Calendrier des Événements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedMonths.map(([month, monthEvents]) => (
            <div key={month} className="space-y-3">
              <h3 className="text-lg font-semibold text-earth-700 border-b border-earth-200 pb-2">
                {month}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 hover:shadow-md transition-all duration-200 ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {event.title}
                          </h4>
                          <span className="text-xs font-semibold whitespace-nowrap ml-2">
                            {formatShortDate(event.date)}
                          </span>
                        </div>
                        <p className="text-xs opacity-75">
                          {formatDate(event.date)}
                        </p>
                        {event.etablissement && (
                          <p className="text-xs font-medium mt-1 opacity-90">
                            {event.etablissement}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-earth-200">
          <h4 className="text-sm font-medium text-earth-700 mb-3">Légende</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-forest-600" />
              <span className="text-sm text-earth-600">Conseils d'administration</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-harvest-600" />
              <span className="text-sm text-earth-600">Audits Financiers</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-earth-600" />
              <span className="text-sm text-earth-600">Audits des Marchés</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
