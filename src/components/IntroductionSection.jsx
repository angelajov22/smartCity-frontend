import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportApi } from "../services/api";

const IntroductionSection = () => {
  const [stats, setStats] = useState({
    resolved: 0,
    active: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const reports = await reportApi.getAll();

        const reportsArray = Array.isArray(reports)
          ? reports
          : reports.content || reports.data || [];

        const resolvedCount = reportsArray.filter(
          (report) => report.status === "RESOLVED",
        ).length;

        const activeCount = reportsArray.filter(
          (report) =>
            report.status === "OPEN" ||
            report.status === "ASSIGNED" ||
            report.status === "IN_PROGRESS",
        ).length;

        setStats({
          resolved: resolvedCount,
          active: activeCount,
        });
      } catch (error) {
        console.error("Failed to load report stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="max-w-lg max-sm:text-center max-sm:px-4">
      <h1 className="text-4xl font-bold max-sm:text-3xl max-sm:leading-tight">
        Твој град, <span className="text-[#0a96f4]">Твоја одговорност.</span>
      </h1>

      <p className="mt-4 text-gray-600 max-sm:text-sm max-sm:leading-relaxed">
        Приклучи се на илјадници граѓани кои секојдневно помагаат во решавањето
        на локалните проблеми. Брзо, лесно и транспарентно.
      </p>

      <div className="mt-8 mb-8 space-x-4 max-sm:flex max-sm:flex-col max-sm:gap-3 max-sm:space-x-0">
        <Link to="/report" className="max-sm:w-full">
          <button className="bg-[#0a96f4] hover:bg-blue-500 text-white px-4 py-2 rounded transition max-sm:w-full max-sm:py-3 max-sm:rounded-xl">
            Започни нова пријава
          </button>
        </Link>

        <Link
          to="/map"
          className="hover:bg-gray-100 border px-4 py-2 rounded inline-block transition !no-underline max-sm:w-full max-sm:py-3 max-sm:rounded-xl"
        >
          Види на мапа
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 max-w-md max-sm:max-w-full max-sm:gap-3">
        <div
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm
                  transition duration-200 transform hover:scale-105 hover:shadow-lg
                  max-sm:p-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-500 max-sm:justify-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-50">
              ✓
            </span>
            Решени
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats.resolved}
          </p>
        </div>

        <div
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm
                  transition duration-200 transform hover:scale-105 hover:shadow-lg
                  max-sm:p-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-400 max-sm:justify-center">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-50">
              ⏱
            </span>
            Активни
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats.active}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionSection;
