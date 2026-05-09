import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./components/admin/DashboardLayout";
import DashboardHomePage from "./pages/admin/DashboardHomePage";
import InstitutionsPage from "./pages/admin/InstitutionsPage";
import AddInstitutionPage from "./pages/admin/AddInstitutionPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import LoginPage from "./pages/admin/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/admin/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route index element={<DashboardHomePage />} />
              <Route path="institutions" element={<InstitutionsPage />} />
              <Route path="institutions/add" element={<AddInstitutionPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
