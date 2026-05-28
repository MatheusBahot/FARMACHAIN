import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";
import TracePage from "./pages/TracePage";
import AdminPage from "./pages/AdminPage";
import ExecutivePage from "./pages/ExecutivePage";
import PharmacovigilancePage from "./pages/PharmacovigilancePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/executivo" element={<ExecutivePage />} />
        <Route path="/farmacovigilancia" element={<PharmacovigilancePage />} />
        <Route path="/trace/:batchId" element={<TracePage />} />
      </Routes>
    </BrowserRouter>
  );
}
