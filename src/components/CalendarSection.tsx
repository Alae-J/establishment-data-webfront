
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileCheck, ShoppingCart, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EventForm from './EventForm';
import ConfirmDialog from './ConfirmDialog';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'conseil' | 'audit-financier' | 'audit-marches';
  etablissement?: string;
}

const CalendarSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events
  const { data: events = [], isLoading: eventsLoading, isError } = useQuery<CalendarEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
  });

  const isAdmin = user?.isAdmin || false;

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

  // Create or update event
  const handleSubmitEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    setIsLoading(true);
    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error('Failed to save event');

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      
      toast({
        title: 'Succès',
        description: editingEvent ? 'Événement modifié' : 'Événement créé',
      });
      
      setEditingEvent(undefined);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'événement',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${deletingEvent.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete event');

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      
      toast({
        title: 'Succès',
        description: 'Événement supprimé',
      });
      
      setDeletingEvent(undefined);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'événement',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const monthKey = eventDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push({ ...event, parsedDate: eventDate });
    return acc;
  }, {} as Record<string, (CalendarEvent & { parsedDate: Date })[]>);

  // Sort events within each month
  const sortedMonths = Object.entries(groupedEvents).sort(([monthA, eventsA], [monthB, eventsB]) => {
    const dateA = eventsA[0].parsedDate;
    const dateB = eventsB[0].parsedDate;
    return dateA.getTime() - dateB.getTime();
  });

  if (isError) {
    return (
      <Card className="border-earth-200">
        <CardContent className="p-6">
          <p className="text-center text-red-600">
            Erreur lors du chargement des événements
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-earth-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-earth-800">
              <Calendar className="w-5 h-5 text-forest-600" />
              Calendrier des Événements
            </CardTitle>
            {isAdmin && (
              <Button
                onClick={() => setIsEventFormOpen(true)}
                size="sm"
                className="bg-forest-600 hover:bg-forest-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-earth-600">Chargement des événements...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-earth-600">
              Aucun événement planifié
            </div>
          ) : (
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
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold whitespace-nowrap">
                                  {formatShortDate(event.parsedDate)}
                                </span>
                                {isAdmin && (
                                  <div className="flex gap-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-white/50"
                                      onClick={() => setEditingEvent(event)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                      onClick={() => setDeletingEvent(event)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs opacity-75">
                              {formatDate(event.parsedDate)}
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
          )}
          
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

      {/* Event Form Modal */}
      <EventForm
        isOpen={isEventFormOpen || !!editingEvent}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(undefined);
        }}
        onSubmit={handleSubmitEvent}
        initialData={editingEvent}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(undefined)}
        onConfirm={handleDeleteEvent}
        title="Supprimer l'événement"
        description={`Êtes-vous sûr de vouloir supprimer "${deletingEvent?.title}" ? Cette action est irréversible.`}
        isLoading={isLoading}
      />
    </>
  );
};

export default CalendarSection;
