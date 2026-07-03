import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'
import SettingsModal from '../settings/SettingsModal'

export default function AdminLayout() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      <main className="relative flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>
      </main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
