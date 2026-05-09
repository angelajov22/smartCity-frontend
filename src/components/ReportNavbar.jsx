import { useNavigate } from "react-router-dom";

function ReportNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="h-20 border-b bg-white flex items-center justify-between px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="!text-2xl !text-gray-700"
        >
          ‹
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            🛡
          </div>

          <span className="text-2xl font-bold text-blue-500">
            МојаОпштина
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="border border-blue-300 text-blue-500 px-4 py-2 rounded-full font-semibold">
          Активна сесија: Центар, Скопје
        </span>

        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
    </nav>
  );
}

export default ReportNavbar;