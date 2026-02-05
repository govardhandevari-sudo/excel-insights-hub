import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DailyRevenue from "./pages/DailyRevenue";
import LabRadReport from "./pages/LabRadReport";
import PaymentMode from "./pages/PaymentMode";
import AvgRealisation from "./pages/AvgRealisation";
import DeptRevenue from "./pages/DeptRevenue";
import Salesperson from "./pages/Salesperson";
import SalespersonDetail from "./pages/SalespersonDetail";
import RefNonRef from "./pages/RefNonRef";
import DeptVolume from "./pages/DeptVolume";
 import SalespersonTargets from "./pages/SalespersonTargets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/revenue" element={<DailyRevenue />} />
          <Route path="/lab-rad" element={<LabRadReport />} />
          <Route path="/payment-mode" element={<PaymentMode />} />
          <Route path="/avg-realisation" element={<AvgRealisation />} />
          <Route path="/dept-revenue" element={<DeptRevenue />} />
          <Route path="/salesperson" element={<Salesperson />} />
          <Route path="/salesperson-detail" element={<SalespersonDetail />} />
          <Route path="/ref-nonref" element={<RefNonRef />} />
          <Route path="/dept-volume" element={<DeptVolume />} />
           <Route path="/salesperson-targets" element={<SalespersonTargets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
