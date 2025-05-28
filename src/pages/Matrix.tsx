
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface MatrixData {
  AE: string[];
  CE: string[];
  IGF: string[];
  CC: string[];
}

const Matrix = () => {
  const { id, year } = useParams<{ id: string; year: string }>();
  const { toast } = useToast();
  const [matrixData, setMatrixData] = useState<MatrixData>({
    AE: ['', '', '', '', '', ''],
    CE: ['', '', '', '', '', ''],
    IGF: ['', '', '', '', '', ''],
    CC: ['', '', '', '', '', '']
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const ROWS = ['AE', 'CE', 'IGF', 'CC'];
  const COLUMNS = ['IC', 'OB', 'REC', 'CA', 'DD', 'DA'];

  const rowLabels: Record<string, string> = {
    AE: 'Autorisations d\'Engagement',
    CE: 'Crédits d\'Engagement',
    IGF: 'Inspection Générale des Finances',
    CC: 'Cour des Comptes'
  };

  const columnLabels: Record<string, string> = {
    IC: 'Investissement Capital',
    OB: 'Objectifs Budgétaires',
    REC: 'Recettes',
    CA: 'Charges d\'Amortissement',
    DD: 'Dépenses Diverses',
    DA: 'Dotations aux Amortissements'
  };

  useEffect(() => {
    loadMatrixData();
  }, [id, year]);

  const loadMatrixData = async () => {
    try {
      const response = await fetch(`/etablissement/${id}/${year}/matrix`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMatrixData(data);
      }
    } catch (error) {
      console.error('Error loading matrix data:', error);
      toast({
        title: "Error",
        description: "Failed to load matrix data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellChange = (row: string, colIndex: number, value: string) => {
    setMatrixData(prev => ({
      ...prev,
      [row]: prev[row as keyof MatrixData].map((cell, index) => 
        index === colIndex ? value : cell
      )
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare form data in the format expected by Flask
      const formData = new FormData();
      
      ROWS.forEach(row => {
        COLUMNS.forEach((col, colIndex) => {
          const fieldName = `${row}_${col}`;
          const value = matrixData[row as keyof MatrixData][colIndex] || '';
          formData.append(fieldName, value);
        });
      });

      const response = await fetch(`/etablissement/${id}/${year}/matrix`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Matrix data saved successfully",
        });
        // Reload data to confirm save
        loadMatrixData();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving matrix data:', error);
      toast({
        title: "Error",
        description: "Failed to save matrix data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-earth-600">Loading matrix data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to={`/etablissement/${id}/${year}`} className="hover:text-earth-800">
              ETAB {id} - {year}
            </Link>
            <span className="mx-2">›</span>
            <span>Matrix Data</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Data Matrix - ETAB {id} ({year})
          </h1>
          <p className="text-earth-600">
            Enter and manage comprehensive data across all categories and indicators.
          </p>
        </div>

        <Card className="border-earth-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-earth-800">Matrix Data Entry</CardTitle>
            <CardDescription>
              Update values for each intersection of rows and columns. All values are automatically saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-earth-300 bg-earth-100 p-3 text-left text-earth-800 font-semibold min-w-[200px]">
                      Category
                    </th>
                    {COLUMNS.map((col) => (
                      <th 
                        key={col} 
                        className="border border-earth-300 bg-earth-100 p-3 text-center text-earth-800 font-semibold min-w-[120px]"
                      >
                        <div className="font-bold">{col}</div>
                        <div className="text-xs font-normal text-earth-600 mt-1">
                          {columnLabels[col]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, rowIndex) => (
                    <tr 
                      key={row}
                      className="animate-fade-in"
                      style={{ animationDelay: `${rowIndex * 0.1}s` }}
                    >
                      <td className="border border-earth-300 bg-forest-50 p-3 font-semibold text-earth-800">
                        <div className="font-bold">{row}</div>
                        <div className="text-xs text-earth-600 mt-1">
                          {rowLabels[row]}
                        </div>
                      </td>
                      {COLUMNS.map((col, colIndex) => (
                        <td key={`${row}_${col}`} className="border border-earth-300 p-2">
                          <Input
                            value={matrixData[row as keyof MatrixData][colIndex] || ''}
                            onChange={(e) => handleCellChange(row, colIndex, e.target.value)}
                            className="border-earth-200 focus:border-forest-500 text-center"
                            placeholder="0"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-earth-200">
              <Button asChild variant="outline" className="border-earth-300 text-earth-700 hover:bg-earth-50">
                <Link to={`/etablissement/${id}/${year}`}>
                  ← Back to Overview
                </Link>
              </Button>
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-forest-600 hover:bg-forest-700"
              >
                {isSaving ? 'Saving...' : 'Save Matrix Data'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Matrix Info */}
        <Card className="border-earth-200 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-lg text-earth-800">Matrix Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-earth-800 mb-2">Row Categories</h4>
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
                <h4 className="font-semibold text-earth-800 mb-2">Column Indicators</h4>
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
};

export default Matrix;
