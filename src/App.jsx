import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SubscribePage from './pages/SubscribePage'
import LoginPage from './pages/LoginPage'
import FamilyDashboard from './pages/FamilyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPage from './pages/PrivacyPage'

function ProtectedFamily({ children }) {
  const token = localStorage.getItem('cv_family_token')
  return token ? children : <Navigate to="/login" replace />
}

function ProtectedAdmin({ children }) {
  const key = localStorage.getItem('cv_admin_key')
  return key ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/suscribirse" element={<SubscribePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<ProtectedFamily><FamilyDashboard /></ProtectedFamily>} />
        <Route path="/admin/login" element={<LoginPage admin />} />
        <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
