import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import Category from "./pages/Category";
import { CartProvider } from "@/store/cart";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collection/:slug" element={<Collection />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/sale" element={<Placeholder title="Sale" />} />
              <Route
                path="/journal"
                element={<Placeholder title="Journal" />}
              />
              <Route path="/about" element={<Placeholder title="About" />} />
              <Route
                path="/contact"
                element={<Placeholder title="Contact" />}
              />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
