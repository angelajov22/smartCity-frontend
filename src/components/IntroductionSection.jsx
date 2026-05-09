import { Link } from "react-router-dom";

const IntroductionSection = () => {
  return (
    <div className="max-w-lg">
      <h1 className="text-4xl font-bold">
        Твој град, <span className="text-[#0a96f4]">Твоја одговорност.</span>
      </h1>

      <p className="mt-4 text-gray-600">
        Приклучи се на илјадници граѓани кои секојдневно помагаат во решавањето
        на локалните проблеми. Брзо, лесно и транспарентно.
      </p>

      <div className="mt-8 mb-8 space-x-4">
        <Link to="/report">
          <button className="bg-[#0a96f4] hover:bg-blue-500 text-white px-4 py-2 rounded transition">
            Започни нова пријава
          </button>
        </Link>

        <Link
          to="/map"
          className="hover:bg-gray-100 border px-4 py-2 rounded inline-block transition !no-underline"
        >
          Види на мапа
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
        <div
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm 
                  transition duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-50">
              ✓
            </span>
            Решени
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">1,248</p>
        </div>

        <div
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm 
                  transition duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-50">
              ⏱
            </span>
            Активни
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">342</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionSection;
