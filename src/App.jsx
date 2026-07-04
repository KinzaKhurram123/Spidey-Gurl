import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './store/useStore'
import { applyAccent } from './lib/accents'
import Login from './pages/Login'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import BirthdaySuite from './pages/BirthdaySuite'
import SorryToolkit from './pages/SorryToolkit'
import AnniversarySuite from './pages/AnniversarySuite'
import ProposalStage from './pages/ProposalStage'
import CustomOccasion from './pages/CustomOccasion'
import BirthdayReveal from './pages/reveal/BirthdayReveal'
import SorryReveal from './pages/reveal/SorryReveal'
import AnniversaryReveal from './pages/reveal/AnniversaryReveal'
import ProposalReveal from './pages/reveal/ProposalReveal'

export default function App() {
  const isAuthenticated = useStore((s) => s.auth.isAuthenticated)
  const themeAccent = useStore((s) => s.settings.themeAccent)

  useEffect(() => {
    applyAccent(themeAccent)
  }, [themeAccent])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15,15,26,0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#ffb020', secondary: '#0b0b1a' } },
          error: { iconTheme: { primary: '#ff3d68', secondary: '#0b0b1a' } },
        }}
      />
      <Routes>
        <Route path="/reveal/birthday" element={<BirthdayReveal />} />
        <Route path="/reveal/sorry" element={<SorryReveal />} />
        <Route path="/reveal/anniversary" element={<AnniversaryReveal />} />
        <Route path="/reveal/proposal" element={<ProposalReveal />} />
        <Route
          path="/*"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Routes>
                <Route element={<AdminLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/birthday" element={<BirthdaySuite />} />
                  <Route path="/sorry" element={<SorryToolkit />} />
                  <Route path="/anniversary" element={<AnniversarySuite />} />
                  <Route path="/proposal" element={<ProposalStage />} />
                  <Route path="/occasion/:id" element={<CustomOccasion />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            )
          }
        />
      </Routes>
    </>
  )
}
