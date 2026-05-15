import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'
import AdminCases from './pages/AdminCases'
import ProblemsMap from './pages/ProblemsMap'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="cases" replace />} />
          <Route path="cases" element={<AdminCases />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="map" replace />} />
          <Route path="map" element={<ProblemsMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
