import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CaseDetailPage from "./pages/CaseDetailPage";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminCases from "./pages/AdminCases";
import ProblemsMap from "./pages/ProblemsMap";

import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<ProblemsMap />} />
          <Route path="/case/:id" element={<CaseDetailPage />} />

          <Route path="/public" element={<PublicLayout />}>
            <Route index element={<Navigate to="map" replace />} />
            <Route path="map" element={<ProblemsMap />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="cases" replace />} />
            <Route path="cases" element={<AdminCases />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
