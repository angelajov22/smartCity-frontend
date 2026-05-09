import { Info, HelpCircle } from "lucide-react";
import logo from "../assets/logo.png";

function MainFooter() {
  return (
    <footer className="bg-slate-50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-[#379ef1]">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain rounded-full border"
            />
            <span>МојГрад</span>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 МојГрад. Сите права се задржани.
          </p>
        </div>

        <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600 md:flex-row md:items-center md:gap-10">
          <a href="#" className="hover:text-[#379ef1]">
            Политика за приватност
          </a>
          <a href="#" className="hover:text-[#379ef1]">
            Услови за користење
          </a>
          <a href="#" className="hover:text-[#379ef1]">
            Контакт
          </a>
        </nav>

        <div className="flex gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#379ef1]">
            <Info size={18} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#379ef1]">
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;