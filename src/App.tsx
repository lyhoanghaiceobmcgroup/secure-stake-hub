import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import InvestorApp from "./pages/InvestorApp";
import BusinessApp from "./pages/BusinessApp";
import AuctionApp from "./pages/AuctionApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to redirect to investor app with portfolio tab active
const PortfolioRedirect = () => {
  // Trigger portfolio tab activation
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('navigate-to-portfolio'));
  }, 100);
  
  return <Navigate to="/investor" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/investor" element={<InvestorApp />} />
              <Route path="/investor/auction" element={<AuctionApp />} />
              <Route path="/business" element={<BusinessApp />} />
              <Route path="/portfolio" element={<PortfolioRedirect />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
