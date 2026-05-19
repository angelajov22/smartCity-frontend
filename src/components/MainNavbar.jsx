import { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "!text-[#0a96f4] font-semibold transition !no-underline"
      : "!text-gray-700 hover:!text-[#0a96f4] transition !no-underline";

  return (
    <header className="sticky top-0 z-50 bg-[#f5f9ff] shadow">
      <nav className="border-b-2 border-blue-200 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <NavLink to="/" end className="flex items-center gap-2 !no-underline">
            <img
              src={logo}
              alt="logo"
              className="h-10 w-10 rounded-full border object-cover"
            />

            <h1 className="!text-xl font-bold tracking-tight !text-[#0082f8] sm:!text-2xl">
              МојГрад
            </h1>
          </NavLink>

          <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <NavLink to="/" end className={navClass}>
              Почетна
            </NavLink>

            <NavLink to="/report" className={navClass}>
              Пријави Проблем
            </NavLink>

            <NavLink to="/active_problems" className={navClass}>
              Активни Проблеми
            </NavLink>

            <NavLink to="/map" className={navClass}>
              Мапа
            </NavLink>

            <NavLink to="/about" className={navClass}>
              За Нас
            </NavLink>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg border border-blue-200 bg-white p-2 text-gray-700 transition hover:bg-blue-50 lg:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-4 text-sm font-medium shadow-sm lg:hidden">
            <NavLink
              onClick={() => setIsOpen(false)}
              to="/"
              end
              className={navClass}
            >
              Почетна
            </NavLink>

            <NavLink
              onClick={() => setIsOpen(false)}
              to="/report"
              className={navClass}
            >
              Пријави Проблем
            </NavLink>

            <NavLink
              onClick={() => setIsOpen(false)}
              to="/active_problems"
              className={navClass}
            >
              Активни Проблеми
            </NavLink>

            <NavLink
              onClick={() => setIsOpen(false)}
              to="/map"
              className={navClass}
            >
              Мапа
            </NavLink>

            <NavLink
              onClick={() => setIsOpen(false)}
              to="/about"
              className={navClass}
            >
              За Нас
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default MainNavbar;
