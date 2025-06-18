
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MatrixCell from '@/components/MatrixCell';
import CellEditor from '@/components/CellEditor';

interface MatrixData {
  AE: string[];
  CE: string[];
  IGF: string[];
  CC: string[];
}

interface MatrixResponse {
  id: number;
  year: number;
  matrix: MatrixData;
  columns: string[];
  rows: string[];
}

const ROWS = ['AE', 'CE', 'IGF', 'CC'] as const;
const COLUMNS = ['IC', 'OB', 'REC', 'CA', 'DD', 'DA'] as const;

export default function Matrix() {
  const { id, year } = useParams<{ id: string; year: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // État local
  const [matrixData, setMatrixData] = useState<MatrixData>({
    AE: ['', '', '', '', '', ''],
    CE: ['', '', '', '', '', ''],
    IGF: ['', '', '', '', '', ''],
    CC: ['', '', '', '', '', ''],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    row: keyof MatrixData;
    colIndex: number;
    value: string;
  } | null>(null);

  const rowLabels: Record<typeof ROWS[number], string> = {
    AE: "Autorisations d'Engagement",
    CE: "Crédits d'Engagement",
    IGF: 'Inspection Générale des Finances',
    CC: 'Cour des Comptes',
  };
  
  const columnLabels: Record<typeof COLUMNS[number], string> = {
    IC: 'Investissement Capital',
    OB: 'Objectifs Budgétaires',
    REC: 'Recettes',
    CA: "Charges d'Amortissement",
    DD: 'Dépenses Diverses',
    DA: 'Dotations aux Amortissements',
  };

  // Chargement des données
  const { data, isLoading, isError } = useQuery<MatrixResponse, Error>({
    queryKey: ['matrix', id, year],
    queryFn: async () => {
      const res = await fetch(`/etablissement/${id}/${year}/matrix`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Échec du chargement');
      return res.json();
    },
    enabled: !!id && !!year,
    refetchOnMount: 'always',
  });
  
  useEffect(() => {
    if (data) {
      setMatrixData(data.matrix);
    }
  }, [data]);

  // Enregistrement
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/etablissement/${id}/${year}/matrix`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matrixData),
      });
      if (!res.ok) throw new Error('Échec de l\'enregistrement');
      toast({ title: 'Succès', description: 'Données enregistrées' });
      queryClient.invalidateQueries({
        queryKey: ['matrix', id, year]
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Échec de l\'enregistrement',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (
    row: keyof MatrixData,
    colIndex: number,
    value: string
  ) => {
    setMatrixData(prev => ({
      ...prev,
      [row]: prev[row].map((cell, idx) =>
        idx === colIndex ? value : cell
      ),
    }));
  };

  const handleCellClick = (row: keyof MatrixData, colIndex: number) => {
    setEditingCell({
      row,
      colIndex,
      value: matrixData[row][colIndex] || ''
    });
  };

  const handleCellSave = (value: string) => {
    if (editingCell) {
      handleCellChange(editingCell.row, editingCell.colIndex, value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 flex items-center justify-center">
          <div className="animate-pulse text-earth-600">
            Chargement de la matrice…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        {/* En-tête */}
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to={`/etablissement/${id}/${year}`} className="hover:text-earth-800">
              ETAB {id} – {year}
            </Link>
            <span className="mx-2">›</span> Matrice
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Matrice de données – ETAB {id} ({year})
          </h1>
          <p className="text-earth-600">
            Modifiez et enregistrez les données matricielles ci-dessous.
          </p>
        </div>

        {/* Saisie */}
        <Card className="border-earth-200 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">
              Saisie des données matricielles
            </CardTitle>
            <CardDescription>
              Cliquez sur une cellule pour l'éditer dans une fenêtre dédiée.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border bg-earth-100 p-2 text-left min-w-[160px]">Catégorie</th>
                    {COLUMNS.map(col => (
                      <th key={col} className="border bg-earth-100 p-2 text-center min-w-[120px]">
                        <div className="font-bold">{col}</div>
                        <div className="text-xs text-earth-600">{columnLabels[col]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row}>
                      <td className="border bg-forest-50 p-2">
                        <div className="font-semibold">{row}</div>
                        <div className="text-xs text-earth-600">{rowLabels[row]}</div>
                      </td>
                      {COLUMNS.map((col, cIdx) => (
                        <td key={col} className="border p-0">
                          <MatrixCell
                            value={matrixData[row][cIdx] || ''}
                            onClick={() => handleCellClick(row, cIdx)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <Button asChild variant="outline">
                <Link to={`/etablissement/${id}/${year}`}>← Retour</Link>
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cell Editor Modal */}
        <CellEditor
          isOpen={!!editingCell}
          onClose={() => setEditingCell(null)}
          value={editingCell?.value || ''}
          onSave={handleCellSave}
          cellLabel={editingCell ? `${editingCell.row}${editingCell.colIndex + 1}` : ''}
          rowLabel={editingCell ? rowLabels[editingCell.row] : ''}
          columnLabel={editingCell ? columnLabels[COLUMNS[editingCell.colIndex]] : ''}
        />

        {/* Légende */}
        <Card className="border-earth-200 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-lg text-earth-800">Informations Matrice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-earth-800 mb-2">Catégories de ligne</h4>
                <div className="space-y-1">
                  {ROWS.map(row => (
                    <div key={row} className="flex justify-between">
                      <span className="font-mono text-earth-600">{row}:</span>
                      <span className="text-earth-700">{rowLabels[row]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-earth-800 mb-2">Indicateurs de colonne</h4>
                <div className="space-y-1">
                  {COLUMNS.map(col => (
                    <div key={col} className="flex justify-between">
                      <span className="font-mono text-earth-600">{col}:</span>
                      <span className="text-earth-700">{columnLabels[col]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
