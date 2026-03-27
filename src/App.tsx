import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import OnboardingView from "./pages/OnboardingView";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <OnboardingProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<OTPVerification />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/contracts/:id" element={<ContractDetail />} />
              </Route>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/view" element={<OnboardingView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
