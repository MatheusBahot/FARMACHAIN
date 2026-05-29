import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";
import TracePage from "./pages/TracePage";
import AdminPage from "./pages/AdminPage";
import ExecutivePage from "./pages/ExecutivePage";
import PharmacovigilancePage from "./pages/PharmacovigilancePage";
import InventoryPage from "./pages/InventoryPage";

function PrivateRoute({ children }) {
  const logged = localStorage.getItem("farmachain-auth") === "true";
  return logged ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/inicio" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/executivo" element={<PrivateRoute><ExecutivePage /></PrivateRoute>} />
        <Route path="/inventario" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="/farmacovigilancia" element={<PrivateRoute><PharmacovigilancePage /></PrivateRoute>} />
        <Route path="/demo" element={<PrivateRoute><DemoPage /></PrivateRoute>} />

        <Route path="/trace/:batchId" element={<TracePage />} />
      </Routes>
    </BrowserRouter>
  );
}
