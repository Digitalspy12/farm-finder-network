
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerCrops from "./pages/FarmerCrops";
import DistributorDashboard from "./pages/DistributorDashboard";
import DistributorProfile from "./pages/DistributorProfile";
import DistributorCrops from "./pages/DistributorCrops";
import Search from "./pages/Search";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/farmer/crops" element={<FarmerCrops />} />
            <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
            <Route path="/distributor/profile" element={<DistributorProfile />} />
            <Route path="/distributor/crops" element={<DistributorCrops />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
