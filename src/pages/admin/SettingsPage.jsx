import { Settings } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-2">
      </div>

      <div className="bg-white rounded-2xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)" }}>
        <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
            <Settings size={36} className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;