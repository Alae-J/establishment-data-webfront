
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EtabDashboard from "./pages/EtabDashboard";
import Etablissements from "./pages/Etablissements";
import EtablissementDetail from "./pages/EtablissementDetail";
import YearlyOverview from "./pages/YearlyOverview";
import Matrix from "./pages/Matrix";
import ReportManagement from "./pages/ReportManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formlogin" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/etab/:name" element={<EtabDashboard />} />
            <Route path="/etablissements" element={<Etablissements />} />
            <Route path="/etablissement/:name" element={<EtablissementDetail />} />
            <Route path="/etablissement/:id/:year" element={<YearlyOverview />} />
            <Route path="/etablissement/:id/:year/matrix" element={<Matrix />} />
            <Route path="/etablissement/insert/:id/:year/:report/:version" element={<ReportManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
