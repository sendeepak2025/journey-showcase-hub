import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import JourneyDetail from "./pages/JourneyDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "@/components/auth/PrivateRoute";
import OpenRoute from "@/components/auth/OpenRoute";
const queryClient = new QueryClient();

export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={

            <PrivateRoute>
              <Index />
            </PrivateRoute>



          } />
          <Route path="/:journeyId" element={

            <PrivateRoute>
              <JourneyDetail />
            </PrivateRoute>

          } />
          <Route path="/login" element={

            <OpenRoute>
              <Login />
            </OpenRoute>


          } />
          <Route path="/register" element={

            <OpenRoute>
              <Register />
            </OpenRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />

      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
