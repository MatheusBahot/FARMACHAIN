import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DemoPage from "./pages/DemoPage";
import TracePage from "./pages/TracePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/trace/:batchId" element={<TracePage />} />
      </Routes>
    </BrowserRouter>
  );
}
