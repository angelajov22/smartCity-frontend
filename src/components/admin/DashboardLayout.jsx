import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Search } from "lucide-react";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Sidebar />

      <div className="lg:ml-[260px] ml-0">
        <div className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-4">
          <div className="flex justify-center mb-6 lg:mb-8">
            <div
              className="relative flex items-center bg-white rounded-2xl transition-all duration-200 hover:shadow-md w-full sm:w-[480px]"
              style={{
                maxWidth: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9",
              }}
            >
              <Search className="absolute left-5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Пребарај..."
                className="w-full py-3.5 pl-12 pr-5 rounded-2xl text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent outline-none transition-all"
                style={{ border: "none" }}
              />
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
