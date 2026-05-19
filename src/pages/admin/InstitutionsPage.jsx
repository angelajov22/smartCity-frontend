import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  FileText,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { institutionApi } from "../../services/api";

const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
  });

  const pageSize = 5;

  const categoryLabels = {
    FIRE: "Пожар",
    WATER: "Водовод и канализација",
    ELECTRICITY: "Електрика",
    TRAFFIC: "Сообраќај",
    POLICE: "Полиција",
    HEALTH: "Здравство",
    WASTE: "Отпад и хигиена",
    ROAD: "Оштетен пат / дупки",
    OTHER: "Останато",
  };

  const loadInstitutions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await institutionApi.getAll();

      const institutionsArray = Array.isArray(data) ? data : [];

      setInstitutions(institutionsArray);

      setStats({
        total: institutionsArray.length,
        active: institutionsArray.length,
        pending: 0,
      });
    } catch (err) {
      setError(err.message || "Настана грешка");
      setInstitutions([]);
      setStats({
        total: 0,
        active: 0,
        pending: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (institutions.length === 0) {
      return;
    }

    const escapeValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const headers = ["ID", "Назив", "Категорија", "Опис", "URL"];
    const rows = institutions.map((inst) => [
      inst.id,
      inst.name,
      inst.category,
      inst.description,
      inst.url,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `institutions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Дали сте сигурни дека сакате да ја избришете институцијата?",
      )
    ) {
      return;
    }

    try {
      await institutionApi.delete(id);
      await loadInstitutions();
    } catch (err) {
      setError(err.message || "Грешка при бришење");
    }
  };

  const totalCount = institutions.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedInstitutions = institutions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="mb-1 lg:mb-2">
        <h1 className="text-[20px] sm:text-2xl font-semibold text-gray-900 tracking-tight">
          Листа на институции
        </h1>

        <p className="text-gray-500 mt-1.5 text-[13px] sm:text-sm font-normal">
          Преглед и управување со институции во системот
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0">
        <StatCard
          title="Вкупни институции"
          value={stats.total}
          loading={loading}
          icon={Building2}
          iconColor="#0a96f4"
          iconBg="#0a96f410"
        />

        <StatCard
          title="Активни институции"
          value={stats.active}
          loading={loading}
          icon={Building2}
          iconColor="#22c55e"
          iconBg="#22c55e10"
          valueClassName="text-green-600"
        />

        <StatCard
          title="Чекаат ажурирање"
          value={stats.pending}
          loading={loading}
          icon={FileText}
          iconColor="#f59e0b"
          iconBg="#f59e0b10"
          valueClassName="text-amber-600"
        />
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-[12px] sm:text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300">
              <Filter size={15} />
              Филтер
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-[12px] sm:text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <Download size={15} />
              Експорт
            </button>
          </div>

          <Link
            to="/admin/institutions/add"
            className="!no-underline flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-[12px] sm:text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 w-full lg:w-auto"
            style={{
              backgroundColor: "#0a96f4",
              boxShadow: "0 4px 12px rgba(10, 150, 244, 0.25)",
            }}
          >
            + Додај нова институција
          </Link>
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-5 sm:mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
            Грешка при преземање на податоци: {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2
              className="animate-spin"
              size={36}
              style={{ color: "#0a96f4" }}
            />
          </div>
        ) : paginatedInstitutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-gray-500 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Building2 size={28} className="text-gray-300" />
            </div>

            <p className="text-base font-semibold text-gray-700">
              Нема податоци
            </p>

            <p className="text-sm text-gray-400 mt-1 font-normal">
              Нема пронајдено институции во системот
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Назив на институција
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Категорија
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Опис
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      URL
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Акции
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedInstitutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} style={{ color: "#0a96f4" }} />
                          </div>

                          <span className="font-semibold text-gray-900 text-sm">
                            {inst.name || "Нема име"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                        {categoryLabels[inst.category] ||
                          inst.category ||
                          "Нема категорија"}
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm font-medium max-w-xs">
                        <p className="line-clamp-2">
                          {inst.description || "Нема опис"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        {inst.url ? (
                          <a
                            href={inst.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Отвори линк
                          </a>
                        ) : (
                          <span className="text-gray-400">Нема URL</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-2 rounded-lg text-gray-400 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                            <Eye size={16} />
                          </button>

                          <button className="p-2 rounded-lg text-gray-400 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(inst.id)}
                            className="p-2 rounded-lg text-gray-400 font-medium hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden bg-[#f8fafc] p-4">
              <div className="flex flex-col gap-4">
                {paginatedInstitutions.map((inst) => (
                  <div
                    key={inst.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={18} style={{ color: "#0a96f4" }} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug break-words">
                          {inst.name || "Нема име"}
                        </h3>

                        <span className="inline-flex mt-2 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0a96f4] text-[11px] font-bold border border-blue-100">
                          {categoryLabels[inst.category] ||
                            inst.category ||
                            "Нема категорија"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                        Опис
                      </p>

                      <p className="text-[12px] font-medium text-gray-700 leading-snug line-clamp-3">
                        {inst.description || "Нема опис"}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-0.5">
                          URL
                        </p>

                        {inst.url ? (
                          <a
                            href={inst.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0a96f4] hover:underline max-w-full"
                          >
                            <span className="truncate">Отвори линк</span>
                            <ExternalLink size={11} className="flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-[12px] font-medium text-gray-400">
                            Нема URL
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-right gap-1 mt-2">
                      <button className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Eye size={13} />
                      </button>

                      <button className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Edit size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(inst.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && institutions.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <p className="text-gray-500 text-[13px] sm:text-sm font-medium">
              Прикажани{" "}
              <span className="font-bold text-gray-800">
                {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              од <span className="font-bold text-gray-800">{totalCount}</span>{" "}
              резултати
            </p>

            <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              {" "}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-[11px] transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronLeft size={14} />
                Претходна
              </button>
              <span className="px-2 py-1.5 text-gray-700 font-semibold text-[11px] whitespace-nowrap">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-[11px] transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Следна
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function StatCard({
  title,
  value,
  loading,
  icon: Icon,
  iconColor,
  iconBg,
  valueClassName = "",
}) {
  return (
    <div
      className="bg-white rounded-2xl p-4 sm:p-6 min-w-[220px] lg:min-w-0 snap-start"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-[12px] sm:text-sm font-medium">
            {title}
          </p>

          {loading ? (
            <Loader2
              className="animate-spin mt-3"
              size={24}
              style={{ color: iconColor }}
            />
          ) : (
            <p
              className={`text-[26px] sm:text-3xl font-semibold mt-2 ${
                valueClassName || ""
              }`}
              style={!valueClassName ? { color: iconColor } : undefined}
            >
              {value}
            </p>
          )}
        </div>

        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}

export default InstitutionsPage;
