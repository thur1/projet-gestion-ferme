import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/Dashboard'
import UnitsPage from './pages/Units'
import LotsPage from './pages/Lots'
import SantePage from './pages/Sante'
import StockPage from './pages/Stock'
import AlimentationPage from './pages/Alimentation'
import ReproductionPage from './pages/Reproduction'
import FinancesPage from './pages/Finances'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { ShellLayout } from './layouts/Shell'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<ShellLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/lots" element={<LotsPage />} />
          <Route path="/sante" element={<SantePage />} />
          <Route path="/alimentation" element={<AlimentationPage />} />
          <Route path="/reproduction" element={<ReproductionPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/finances" element={<FinancesPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}
