// src/pages/EtablissementDetail.tsx
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import {
  EstablishmentDetail,
  establishmentDetails,
} from "@/data/establishmentDetails";

const EtablissementDetail: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number | "">( "");

  if (isLoading) return null;
  if (!user || !user.isAdmin) return <Navigate to="/formlogin" replace />;

  // lookup in our helper map
  const info: EstablishmentDetail =
    (name && establishmentDetails[name]) || {
      title:       "Établissement Inconnu",
      description: "Aucune information disponible.",
      features:    [],
      regions:     [],
    };

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const report = "default";
  const version = "v1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-forest-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb + Header */}
        <nav className="text-sm text-earth-600 mb-4">
          <Link to="/etablissements" className="hover:text-earth-800">
            Établissements
          </Link>
          <span className="mx-2">›</span>
          <span>{info.title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-earth-800 mb-4">
          {info.title}
        </h1>
        <p className="text-lg text-earth-600 max-w-4xl mb-8">
          {info.description}
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* left/main area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-earth-200 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">
                  Fonctionnalités & Services
                </CardTitle>
                <CardDescription>Fonctions clés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {info.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 p-3 bg-forest-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-forest-600 rounded-full" />
                      <span className="text-earth-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-earth-200 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-earth-800">
                  Couverture Régionale
                </CardTitle>
                <CardDescription>Zones d’intervention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {info.regions.map((reg, i) => (
                    <div
                      key={i}
                      className="p-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                    >
                      <span className="text-earth-700 font-medium">{reg}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            <Card className="border-earth-200 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="year-select"
                    className="text-sm text-earth-700"
                  >
                    Choisir une année
                  </label>
                  <select
                    id="year-select"
                    className="w-full border border-earth-300 rounded px-3 py-2 text-earth-700"
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  >
                    <option value="">-- Sélectionner une année --</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  disabled={!selectedYear}
                  onClick={() =>
                    navigate(
                      `/etablissement/insert/${name}/${selectedYear}/${report}/${version}`
                    )
                  }
                  className="w-full bg-forest-600 hover:bg-forest-700"
                >
                  Accéder au système
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
                >
                  <Link to="/etablissements">
                    ← Retour aux établissements
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-earth-200 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <CardTitle className="text-lg text-earth-800">
                  Informations Complémentaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-earth-600">
                <div className="p-3 bg-harvest-50 rounded-lg">
                  <div className="font-medium text-harvest-800 mb-1">
                    Gestion des Données
                  </div>
                  <div>Suivi basé sur des matrices pour une analyse complète</div>
                </div>
                <div className="p-3 bg-forest-50 rounded-lg">
                  <div className="font-medium text-forest-800 mb-1">
                    Rapports
                  </div>
                  <div>Documents PDF avec gestion des versions</div>
                </div>
                <div className="p-3 bg-earth-50 rounded-lg">
                  <div className="font-medium text-earth-800 mb-1">
                    Suivi Pluriannuel
                  </div>
                  <div>Analyse des données historiques et suivi des tendances</div>
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
