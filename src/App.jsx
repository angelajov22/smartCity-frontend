import { BrowserRouter, Routes, Route } from "react-router-dom"

import ReportForm from "./pages/ReportForm"
import CasesList from "./pages/CasesList"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/report"
          element={<ReportForm />}
        />

        <Route
          path="/problems"
          element={<CasesList />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App