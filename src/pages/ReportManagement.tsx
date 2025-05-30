import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ReportManagement() {
  const { id, year, report, version } = useParams<{
    id: string
    year: string
    report: string
    version: string
  }>()
  const { toast } = useToast()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 1) load existing PDF list
  const { data: files = [], isLoading: loadingFiles } = useQuery<string[], Error>({
    queryKey: ['reports', id, year, report, version],
    queryFn: async () => {
      const res = await fetch(
        `/etablissement/insert/${id}/${year}/${report}/${version}`,
        {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        }
      )
      if (!res.ok) throw new Error('Échec du chargement des rapports')
      const json = await res.json()
      // endpoint returns { paths: [...] }
      return (json.paths as string[]) || []
    },
  })

  // 2) mutation to upload
  const uploadMutation = useMutation<
    { filename: string },
    Error,
    File
  >({
    mutationFn: (file) => {
      const form = new FormData()
      form.append('file', file)
      return fetch(
        `/saveFile/${id}/${year}/${report}/${version}`,
        {
          method: 'POST',
          credentials: 'include',
          body: form,
        }
      ).then(res => {
        if (!res.ok) throw new Error('Échec du téléversement')
        return res.json()
      })
    },
    onSuccess: ({ filename }) => {
      toast({ title: 'Succès', description: 'Fichier téléversé.' })
      setSelectedFile(null)
      queryClient.invalidateQueries({
        queryKey: ['reports', id, year, report, version]
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de téléverser le fichier.',
        variant: 'destructive',
      })
    }
  })
  const { mutate, status } = uploadMutation
  const isUploading = status === 'pending'


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Type invalide',
        description: 'Merci de sélectionner un PDF.',
        variant: 'destructive',
      })
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) mutate(selectedFile)
  }

  function getPdfUrl(fn: string) {
    const basename = fn.split('/').pop()!
    return `/uploads/${id}/${year}/${report}/${version}/${basename}`
  }

  if (loadingFiles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 flex items-center justify-center">
          <div className="animate-pulse text-earth-600">Chargement…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 animate-fade-in">
          <nav className="text-sm text-earth-600 mb-4">
            <Link to={`/etablissement/${id}/${year}`} className="hover:text-earth-800">
              ETAB {id} – {year}
            </Link>
            <span className="mx-2">›</span>
            <span>{report} ({version})</span>
          </nav>
          <h1 className="text-3xl font-bold text-earth-800 mb-2">
            Gestion des rapports
          </h1>
          <p className="text-earth-600">
            ETAB {id} – {report?.toUpperCase()} – {version?.toUpperCase()} ({year})
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload */}
          <div className="lg:col-span-1">
            <Card className="border-earth-200 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">Téléverser un PDF</CardTitle>
                <CardDescription>Sélectionnez un document PDF</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="block w-full border border-earth-200 p-2 rounded focus:border-forest-500"
                />
                {selectedFile && (
                  <div className="p-3 bg-forest-50 rounded-lg">
                    <div className="text-sm font-medium text-forest-800">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-forest-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full bg-forest-600 hover:bg-forest-700"
                >
                  {isUploading ? 'Téléversement…' : 'Téléverser'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* File list */}
          <div className="lg:col-span-2">
            <Card className="border-earth-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">
                  Rapports ({files.length})
                </CardTitle>
                <CardDescription>Voir et télécharger les PDFs</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8 text-earth-600">
                    <p>Aucun fichier</p>
                    <p className="text-sm">Téléversez votre premier PDF.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {files.map(fn => {
                      const basename = fn.split('/').pop()!
                      return (
                        <div
                          key={basename}
                          className="border border-earth-200 rounded-lg p-4 animate-fade-in"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-red-600">PDF</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-earth-800 truncate">{basename}</div>
                              <div className="text-xs text-earth-600 mt-1">
                                {report} – {version}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button asChild size="sm" variant="outline" className="flex-1">
                              <a href={getPdfUrl(fn)} target="_blank" rel="noopener noreferrer">
                                Voir
                              </a>
                            </Button>
                            <Button asChild size="sm" className="flex-1 bg-forest-600 hover:bg-forest-700">
                              <a href={getPdfUrl(fn)} download>
                                Télécharger
                              </a>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview */}
        {files.length > 0 && (
          <Card className="border-earth-200 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-lg text-earth-800">Aperçu</CardTitle>
              <CardDescription>Dernier document</CardDescription>
            </CardHeader>
            <CardContent>
            <iframe
              src={getPdfUrl(files[files.length - 1])}
              className="w-full h-[800px] border rounded"
              title="Preview PDF"
            />
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to={`/etablissement/${id}/${year}`}>← Retour à l’aperçu</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
