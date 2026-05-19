import { Info, HelpCircle } from "lucide-react";
import logo from "../assets/logo.png";

function MainFooter() {
  return (
    <footer className="bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-2 text-xl font-bold text-[#379ef1]">
            <img
              src={logo}
              alt="logo"
              className="h-12 w-12 rounded-full border object-contain"
            />

            <span>МојГрад</span>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 МојГрад. Сите права се задржани.
          </p>
        </div>

        <nav className="flex flex-col items-center gap-4 text-center text-sm font-medium text-gray-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
          <a href="#" className="!no-underline transition hover:text-[#379ef1]">
            Политика за приватност
          </a>

          <a href="#" className="!no-underline transition hover:text-[#379ef1]">
            Услови за користење
          </a>

          <a href="#" className="!no-underline transition hover:text-[#379ef1]">
            Контакт
          </a>
        </nav>

        <div className="flex items-center justify-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:scale-105 hover:text-[#379ef1]">
            <Info size={18} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:scale-105 hover:text-[#379ef1]">
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
