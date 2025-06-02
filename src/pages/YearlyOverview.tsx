
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

interface StaticReportType {
  report_type_id: number;
  key: string;
  description: string;
}

interface UploadedReportSection {
  key: string;
  name: string;
  description: string;
  versions: string[];
}

interface EtabInfo {
  id: number;
  label: string;
  key: string;
}

interface ReportGroup {
  id: string;
  name: string;
  color: string;
  sections: UploadedReportSection[];
}

const YearlyOverview: React.FC = () => {
  const { id, year } = useParams<{ id: string; year: string }>();
  const etabId = Number(id);
  const etabYear = Number(year);

  const {
    data: etabInfo = { id: etabId, label: `ETAB ${etabId}`, key: '' },
    isLoading: loadingEtabInfo,
    isError: errorEtabInfo,
  } = useQuery<EtabInfo, Error>({
    queryKey: ['etabInfo', etabId],
    queryFn: async () => {
      const res = await fetch(`/api/etablissement/${etabId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load establishment info');
      const json = await res.json();
      return json.etablissement as EtabInfo;
    },
    enabled: !!etabId,
  });

  const {
    data: staticTypes = [],
    isLoading: loadingStaticTypes,
    isError: errorStaticTypes,
  } = useQuery<StaticReportType[], Error>({
    queryKey: ['staticReportTypes'],
    queryFn: async () => {
      const res = await fetch('/api/report-types', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load static report types');
      const json = await res.json();
      return json.report_types as StaticReportType[];
    },
  });

  const {
    data: uploadedSections = [],
    isLoading: loadingUploaded,
    isError: errorUploaded,
  } = useQuery<UploadedReportSection[], Error>({
    queryKey: ['reportMetadata', etabId, etabYear],
    queryFn: async () => {
      const res = await fetch(`/api/report-metadata/${etabId}/${etabYear}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load report metadata');
      const json = await res.json();
      return json.reports as UploadedReportSection[];
    },
    enabled: !!etabId && !!etabYear,
  });

  if (loadingEtabInfo || loadingStaticTypes || loadingUploaded) return <p>Chargement en cours…</p>;
  if (errorEtabInfo) return <p>Impossible de charger les informations de l'établissement.</p>;
  if (errorStaticTypes) return <p>Impossible de charger la liste des types de rapports.</p>;
  if (errorUploaded) return <p>Impossible de charger les rapports existants.</p>;

  const uploadedMap = new Map<string, UploadedReportSection>();
  for (const section of uploadedSections) {
    uploadedMap.set(section.key, section);
  }

  const allSections = staticTypes.map<UploadedReportSection>((rtype) => {
    if (uploadedMap.has(rtype.key)) {
      return uploadedMap.get(rtype.key)!;
    } else {
      return {
        key: rtype.key,
        name: rtype.key,
        description: rtype.description,
        versions: [],
      };
    }
  });

  // Group definitions with modern color schemes
  const reportGroups: ReportGroup[] = [
    {
      id: 'cps-rc',
      name: 'CPS‐RC',
      color: 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200',
      sections: allSections.filter(s => s.key === 'CPS‐RC'),
    },
    {
      id: 'acf',
      name: 'ACF / PV-ACF',
      color: 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200',
      sections: allSections.filter(s => ['ACF', 'PV-ACF'].includes(s.key)),
    },
    {
      id: 'aud',
      name: 'AUD-MR / PV-ADM',
      color: 'bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200',
      sections: allSections.filter(s => ['AUD-MR', 'PV-ADM'].includes(s.key)),
    },
    {
      id: 'dos',
      name: 'DOS-ADM / PV-CA',
      color: 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200',
      sections: allSections.filter(s => ['DOS-ADM', 'PV-CA'].includes(s.key)),
    },
    {
      id: 'rce',
      name: 'RCE',
      color: 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200',
      sections: allSections.filter(s => s.key === 'RCE'),
    },
    {
      id: 'gov',
      name: 'GOV',
      color: 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200',
      sections: allSections.filter(s => s.key === 'GOV'),
    },
  ].filter(group => group.sections.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to="/etablissements" className="hover:text-earth-800">Établissements</Link>
            <span className="mx-2">›</span>
            <span>{etabInfo.label}</span>
            <span className="mx-2">›</span>
            <span>{year}</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">{etabInfo.label} – {year} Overview</h1>
          <p className="text-earth-600">Gestion des matrices et rapports pour {etabInfo.label} en {year}.</p>
        </div>

        {/* Matrix Section */}
        <Card className="border-earth-200 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-forest-600 rounded" />
              <span>Matrice de Données</span>
            </CardTitle>
            <CardDescription>Accéder et gérer la matrice de données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-forest-600 hover:bg-forest-700 flex-1">
                <Link to={`/etablissement/${etabId}/${etabYear}/matrix`}>Accéder à la matrice</Link>
              </Button>
              <div className="text-sm text-earth-600 flex items-center">
                <span>4 lignes × 6 colonnes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <Card className="border-earth-200 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-xl text-earth-800 flex items-center space-x-2">
              <div className="w-5 h-5 bg-harvest-600 rounded" />
              <span>Gestion des Rapports</span>
            </CardTitle>
            <CardDescription>Types de rapports organisés par groupes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reportGroups.map((group, groupIndex) => (
                <div 
                  key={group.id} 
                  className={`${group.color} rounded-xl p-6 border-2 animate-fade-in hover:shadow-lg transition-all duration-300`}
                  style={{ animationDelay: `${0.3 + groupIndex * 0.1}s` }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <span>{group.name}</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {group.sections.map((section, sectionIndex) => (
                      <div
                        key={section.key}
                        className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50 hover:bg-white/90 transition-all duration-200 hover:shadow-md"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{section.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{section.description}</p>
                        <div className="space-y-2">
                          {section.versions.length > 0 ? (
                            section.versions.map((ver) => (
                              <Button
                                key={ver}
                                asChild
                                variant="outline"
                                size="sm"
                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                              >
                                <Link to={`/etablissement/insert/${etabId}/${etabYear}/${section.key}/${encodeURIComponent(ver)}`}>
                                  {section.name} – {ver.toUpperCase()}
                                </Link>
                              </Button>
                            ))
                          ) : (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                              <Link to={`/etablissement/insert/${etabId}/${etabYear}/${section.key}/v1`}>
                                Créer {section.name}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-lg text-earth-800">Légende des groupes de rapports</CardTitle>
            <CardDescription>Signification des couleurs pour chaque type de rapport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'CPS‐RC', description: 'Comptes et États Financiers', color: 'bg-gradient-to-r from-amber-400 to-yellow-400' },
                { name: 'ACF / PV-ACF', description: 'Audits et Contrôles Financiers', color: 'bg-gradient-to-r from-emerald-400 to-green-400' },
                { name: 'AUD-MR / PV-ADM', description: 'Audits et Administration', color: 'bg-gradient-to-r from-blue-400 to-sky-400' },
                { name: 'DOS-ADM / PV-CA', description: 'Dossiers Administratifs', color: 'bg-gradient-to-r from-orange-400 to-amber-400' },
                { name: 'RCE', description: 'Rapports de Contrôle Externe', color: 'bg-gradient-to-r from-purple-400 to-violet-400' },
                { name: 'GOV', description: 'Gouvernance et Stratégie', color: 'bg-gradient-to-r from-rose-400 to-pink-400' },
              ].map((item, index) => (
                <div key={item.name} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className={`w-4 h-4 rounded-full ${item.color} shadow-sm`}></div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YearlyOverview;
