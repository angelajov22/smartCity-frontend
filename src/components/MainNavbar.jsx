import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const MainNavbar = () => {
  const navClass = ({ isActive }) =>
    isActive
      ? "!text-[#0a96f4] font-semibold transition !no-underline"
      : "!text-gray-700 hover:!text-[#0a96f4] transition !no-underline";

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#f5f9ff] border-b-2 border-blue-200 shadow">
      <div className="flex items-center gap-8">
        <NavLink to="/" end className="flex items-center gap-2 !no-underline">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 border rounded-full object-cover"
          />

          <h1 className="!text-[#0082f8] font-bold tracking-tight !text-2xl">
            МојГрад
          </h1>
        </NavLink>

        <div className="flex gap-6 text-sm font-medium">
          <NavLink to="/" end className={navClass}>
            Почетна
          </NavLink>

          <NavLink to="/report" className={navClass}>
            Пријави Проблем
          </NavLink>

          <NavLink to="/problems" className={navClass}>
            Активни Проблеми
          </NavLink>

          <NavLink to="/map" className={navClass}>
            Мапа
          </NavLink>

          <NavLink to="/about" className={navClass}>
            За Нас
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;