import { useState, createContext, useContext } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  MapPin,
  Settings,
  Activity
} from 'lucide-react'

const SidebarContext = createContext()
export const useSidebar = () => useContext(SidebarContext)

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Контролна табла', path: '/admin/dashboard' },
  { icon: FileText, label: 'Преглед на случаи', path: '/admin/cases' },
  { icon: Users, label: 'Корисници', path: '/admin/users' },
  { icon: MapPin, label: 'Мапа на проблеми', path: '/admin/map' },
  { icon: Settings, label: 'Поставки', path: '/admin/settings' },
]

export default function AdminLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 88 : 280

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fe' }}>

        {/* ===== SIDEBAR ===== */}
        <aside
          className="shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
          style={{
            width: sidebarWidth,
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            background: 'white',
            borderRight: '1px solid rgba(226, 232, 240, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            zIndex: 40,
          }}
        >

          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: collapsed ? '36px 0' : '36px 32px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: 24,
          }}>
            <div 
              className="shadow-lg shadow-blue-500/20"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Градски<span className="text-blue-600">Инфо</span>
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: collapsed ? '0 16px' : '0 20px',
            }}>
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: collapsed ? '14px 0' : '14px 20px',
                      borderRadius: 16,
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'white' : '#64748b',
                      background: isActive ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      boxShadow: isActive ? '0 8px 16px rgba(59, 130, 246, 0.25)' : 'none',
                      transform: isActive ? 'translateY(-1px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.color = '#334155'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#64748b'
                        e.currentTarget.style.transform = 'none'
                      }
                    }}
                  >
                    <Icon style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      color: isActive ? 'white' : '#94a3b8',
                      transition: 'color 0.3s ease'
                    }} />
                    {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          </nav>

          {/* Bottom Section: User Profile */}
          <div style={{ padding: collapsed ? '24px 16px' : '32px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: collapsed ? '12px 0' : '12px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: collapsed ? 'transparent' : '#f8fafc',
              borderRadius: 16,
              transition: 'background 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => { if(!collapsed) e.currentTarget.style.background = '#f1f5f9' }}
            onMouseLeave={(e) => { if(!collapsed) e.currentTarget.style.background = '#f8fafc' }}
            >
              <img 
                src="https://ui-avatars.com/api/?name=Александар+П&background=e2e8f0&color=475569" 
                alt="Александар П." 
                style={{ width: 40, height: 40, borderRadius: '12px', objectFit: 'cover' }}
              />
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Александар П.</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginTop: 2 }}>Главен Админ</span>
                </div>
              )}
            </div>
          </div>

        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: sidebarWidth,
            transition: 'margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Outlet />
        </main>

      </div>
    </SidebarContext.Provider>
  )
}
