
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
import CellEditor from '@/components/CellEditor';
import MatrixCell from '@/components/MatrixCell';

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

interface EditingCell {
  row: keyof MatrixData;
  colIndex: number;
}

const ROWS = ['AE', 'CE', 'IGF', 'CC'] as const;
const COLUMNS = ['IC', 'OB', 'REC', 'CA', 'DD', 'DA'] as const;

export default function Matrix() {
  const { id, year } = useParams<{ id: string; year: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // état local
  const [matrixData, setMatrixData] = useState<MatrixData>({
    AE: ['', '', '', '', '', ''],
    CE: ['', '', '', '', '', ''],
    IGF: ['', '', '', '', '', ''],
    CC: ['', '', '', '', '', ''],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

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

  // 1) Chargement des données
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

  // 2) Enregistrement
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/etablissement/${id}/${year}/matrix`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matrixData),
      });
      if (!res.ok) throw new Error('Échec de l'enregistrement');
      toast({ title: 'Succès', description: 'Données enregistrées' });
      queryClient.invalidateQueries({
        queryKey: ['matrix', id, year]
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Échec de l'enregistrement',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellClick = (row: keyof MatrixData, colIndex: number) => {
    setEditingCell({ row, colIndex });
  };

  const handleCellSave = (value: string) => {
    if (!editingCell) return;
    
    setMatrixData(prev => ({
      ...prev,
      [editingCell.row]: prev[editingCell.row].map((cell, idx) =>
        idx === editingCell.colIndex ? value : cell
      ),
    }));
  };

  const handleCloseEditor = () => {
    setEditingCell(null);
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
            Cliquez sur une cellule pour l'éditer. Les textes longs sont automatiquement tronqués.
          </p>
        </div>

        {/* Saisie */}
        <Card className="border-earth-200 mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">
              Matrice de données Excel-like
            </CardTitle>
            <CardDescription>
              Cliquez sur n'importe quelle cellule pour ouvrir l'éditeur de texte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="border bg-gradient-to-r from-earth-100 to-earth-200 p-3 text-left font-bold text-earth-800">
                      Catégorie
                    </th>
                    {COLUMNS.map(col => (
                      <th key={col} className="border bg-gradient-to-r from-earth-100 to-earth-200 p-3 text-center font-bold text-earth-800 min-w-[120px]">
                        <div className="font-bold text-sm">{col}</div>
                        <div className="text-xs font-normal text-earth-600 mt-1">
                          {columnLabels[col]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, rIdx) => (
                    <tr key={row} className="hover:bg-earth-25">
                      <td className="border bg-gradient-to-r from-forest-50 to-forest-100 p-3">
                        <div className="font-semibold text-forest-800">{row}</div>
                        <div className="text-xs text-forest-600 mt-1">
                          {rowLabels[row]}
                        </div>
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
                {isSaving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Légende */}
        <Card className="border-earth-200 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-lg text-earth-800">Guide d'utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-earth-800 mb-2">Instructions</h4>
                <ul className="space-y-2 text-earth-600">
                  <li>• Cliquez sur une cellule pour l'éditer</li>
                  <li>• Les textes longs sont tronqués avec "..."</li>
                  <li>• L'éditeur s'ouvre dans une fenêtre modale</li>
                  <li>• Utilisez Échap pour annuler</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-earth-800 mb-2">Raccourcis</h4>
                <ul className="space-y-2 text-earth-600">
                  <li>• Ctrl+S : Enregistrer les modifications</li>
                  <li>• Échap : Fermer l'éditeur</li>
                  <li>• Tab : Navigation entre cellules</li>
                  <li>• Entrée : Valider la saisie</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cell Editor Modal */}
        {editingCell && (
          <CellEditor
            isOpen={true}
            onClose={handleCloseEditor}
            value={matrixData[editingCell.row][editingCell.colIndex] || ''}
            onSave={handleCellSave}
            cellLabel={`${editingCell.row}-${COLUMNS[editingCell.colIndex]}`}
            rowLabel={rowLabels[editingCell.row]}
            columnLabel={columnLabels[COLUMNS[editingCell.colIndex]]}
          />
        )}
      </div>
    </div>
  );
}
