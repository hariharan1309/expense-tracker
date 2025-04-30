import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./lib/AuthContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
