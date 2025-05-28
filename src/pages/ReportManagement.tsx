
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const ReportManagement = () => {
  const { id, year, report, version } = useParams<{ 
    id: string; 
    year: string; 
    report: string; 
    version: string; 
  }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadFiles();
  }, [id, year, report, version]);

  const loadFiles = async () => {
    try {
      const response = await fetch(
        `/etablissement/insert/${id}/${year}/${report}/${version}`,
        {
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFiles(data.paths || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(
        `/saveFile/${id}/${year}/${report}/${version}`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload files
        loadFiles();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getPdfUrl = (fileName: string) => {
    return `/uploads/${id}/${year}/${report}/${version}/${fileName}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-earth-600">Loading reports...</div>
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
            <span>{report} ({version})</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Report Management
          </h1>
          <p className="text-earth-600">
            ETAB {id} - {report?.toUpperCase()} Reports - {version?.toUpperCase()} ({year})
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="border-earth-200 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">Upload New Report</CardTitle>
                <CardDescription>Upload PDF documents for this report category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="border-earth-200 focus:border-forest-500"
                  />
                  <p className="text-xs text-earth-600 mt-1">
                    Only PDF files are allowed
                  </p>
                </div>
                
                {selectedFile && (
                  <div className="p-3 bg-forest-50 rounded-lg">
                    <div className="text-sm font-medium text-forest-800">
                      Selected: {selectedFile.name}
                    </div>
                    <div className="text-xs text-forest-600">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full bg-forest-600 hover:bg-forest-700"
                >
                  {isUploading ? 'Uploading...' : 'Upload Report'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Files List */}
          <div className="lg:col-span-2">
            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">
                  Uploaded Reports ({files.length})
                </CardTitle>
                <CardDescription>View and download existing report files</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-earth-600">
                    <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-earth-300 rounded"></div>
                    </div>
                    <p>No reports uploaded yet</p>
                    <p className="text-sm">Upload your first PDF report to get started</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {files.map((fileName, index) => (
                      <div 
                        key={fileName}
                        className="border border-earth-200 rounded-lg p-4 hover:shadow-md transition-shadow animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-red-600">PDF</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-earth-800 truncate">
                              {fileName}
                            </div>
                            <div className="text-xs text-earth-600 mt-1">
                              {report} - {version}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="flex-1 border-earth-300 text-earth-700 hover:bg-earth-50"
                          >
                            <a 
                              href={getPdfUrl(fileName)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-forest-600 hover:bg-forest-700"
                          >
                            <a 
                              href={getPdfUrl(fileName)} 
                              download
                            >
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PDF Viewer for latest file */}
        {files.length > 0 && (
          <Card className="border-earth-200 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Document Preview</CardTitle>
              <CardDescription>Preview of the most recent document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4">
                <iframe
                  src={getPdfUrl(files[files.length - 1])}
                  className="w-full h-96 border border-earth-200 rounded"
                  title="PDF Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-start">
          <Button 
            asChild 
            variant="outline" 
            className="border-earth-300 text-earth-700 hover:bg-earth-50"
          >
            <Link to={`/etablissement/${id}/${year}`}>
              ← Back to {year} Overview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
