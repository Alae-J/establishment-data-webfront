
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import EtabDashboard from "./pages/EtabDashboard";
import EtablissementDetail from "./pages/EtablissementDetail";
import Etablissements from "./pages/Etablissements";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Matrix from "./pages/Matrix";
import NotFound from "./pages/NotFound";
import ReportManagement from "./pages/ReportManagement";
import YearlyOverview from "./pages/YearlyOverview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        {/* les routes */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formlogin" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/etab/:id" element={<EtabDashboard />} />
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
