import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/Dashboard'
import LotsPage from './pages/Lots'
import SantePage from './pages/Sante'
import StockPage from './pages/Stock'
import LoginPage from './pages/Login'
import { ShellLayout } from './layouts/Shell'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<ShellLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/lots" element={<LotsPage />} />
          <Route path="/sante" element={<SantePage />} />
          <Route path="/stock" element={<StockPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
