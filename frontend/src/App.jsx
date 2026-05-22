import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import ClienteDashboard from "./pages/ClienteDashboard.jsx";
import AdvogadoDashboard from "./pages/AdvogadoDashboard.jsx";

export default function App() {
  const rotaPrivada = (tipos, pagina) => (
    <ProtectedRoute tipos={tipos}>{pagina}</ProtectedRoute>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/cliente" element={rotaPrivada(["cliente"], <ClienteDashboard />)} />
            <Route path="/advogado" element={rotaPrivada(["advogado"], <AdvogadoDashboard />)} />
          </Routes>
        </main>
        <footer className="footer">Vigia Jurídico © 2026</footer>
      </BrowserRouter>
    </AuthProvider>
  );
}
