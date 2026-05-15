import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CaseDetailPage from "./pages/CaseDetailPage";
import ProblemsMap from "./pages/ProblemsMap";

import DashboardLayout from "./components/admin/DashboardLayout";
import DashboardHomePage from "./pages/admin/DashboardHomePage";
import InstitutionsPage from "./pages/admin/InstitutionsPage";
import AddInstitutionPage from "./pages/admin/AddInstitutionPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

import AdminCases from "./pages/AdminCases";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<ProblemsMap />} />
            <Route path="/case/:id" element={<CaseDetailPage />} />

            {/* Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin protected */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route index element={<DashboardHomePage />} />
                <Route path="cases" element={<AdminCases />} />
                <Route path="institutions" element={<InstitutionsPage />} />
                <Route
                  path="institutions/add"
                  element={<AddInstitutionPage />}
                />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
