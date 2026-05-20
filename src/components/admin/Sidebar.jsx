import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Аналитика" },
  { path: "/admin/cases", icon: Activity, label: "Преглед на случаи" },
  { path: "/admin/institutions", icon: Building2, label: "Институции" },
  { path: "/admin/users", icon: Users, label: "Администратори" },
];

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate("/admin/login");
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{
          zIndex: 1100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Мој Град Logo"
            className="w-9 h-9 rounded-xl object-contain"
          />

          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "#0a96f4" }}
          >
            Мој Град
          </h1>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="lg:hidden fixed inset-0 bg-black/40"
          style={{ zIndex: 1000 }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white flex flex-col
          pt-16 lg:pt-0
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          width: 260,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
          zIndex: 1050,
        }}
      >
        {/* Desktop logo */}
        <div className="hidden lg:block p-5 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <img
              src={logo}
              alt="Мој Град Logo"
              className="w-10 h-10 rounded-xl object-contain"
            />

            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#0a96f4" }}
            >
              Мој Град
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          {isLoggedIn ? (
            menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => {
                  const baseClass =
                    "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 font-semibold text-sm no-underline cursor-pointer";

                  const activeClass = isActive
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

                  return `${baseClass} ${activeClass}`;
                }}
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: "#0a96f4",
                        textDecoration: "none",
                      }
                    : {
                        textDecoration: "none",
                      }
                }
                end={item.path === "/admin"}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))
          ) : (
            <NavLink
              to="/admin/login"
              onClick={closeMobileMenu}
              className={({ isActive }) => {
                const baseClass =
                  "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 font-semibold text-sm no-underline cursor-pointer";

                const activeClass = isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

                return `${baseClass} ${activeClass}`;
              }}
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: "#0a96f4",
                      textDecoration: "none",
                    }
                  : {
                      textDecoration: "none",
                    }
              }
            >
              <LogIn size={20} />
              <span>Најави се</span>
            </NavLink>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <LogOut size={18} />
              Одјави се
            </button>
          )}
        </div>

        <div style={{ height: 24 }}></div>
      </div>
    </>
  );
};

export default Sidebar;
