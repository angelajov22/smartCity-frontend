import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import MainNavbar from '../components/MainNavbar'

export default function PublicLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <MainNavbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-5">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#4f6ef7] to-[#6c5ce7] flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">
                <span className="text-[#0a96f4]">Мој</span>Град
              </p>
              <p className="text-xs text-gray-400">© 2026 МојГрад. Сите права се задржани.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">Политика за приватност</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Услови за користење</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Контакт</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Системот е онлајн
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
