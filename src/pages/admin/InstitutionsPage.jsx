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

  const pageSize = 10;

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
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Листа на институции
        </h1>

        <p className="text-gray-500 mt-1.5 text-sm font-normal">
          Преглед и управување со институции во системот
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div
          className="bg-white rounded-2xl p-6"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Вкупни институции
              </p>

              {loading ? (
                <Loader2
                  className="animate-spin mt-3"
                  size={24}
                  style={{ color: "#0a96f4" }}
                />
              ) : (
                <p
                  className="text-3xl font-semibold mt-2"
                  style={{ color: "#0a96f4" }}
                >
                  {stats.total}
                </p>
              )}
            </div>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#0a96f410" }}
            >
              <Building2 size={22} style={{ color: "#0a96f4" }} />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl p-6"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Активни институции
              </p>

              {loading ? (
                <Loader2
                  className="animate-spin mt-3"
                  size={24}
                  style={{ color: "#22c55e" }}
                />
              ) : (
                <p className="text-3xl font-semibold mt-2 text-green-600">
                  {stats.active}
                </p>
              )}
            </div>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#22c55e10" }}
            >
              <Building2 size={22} style={{ color: "#22c55e" }} />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl p-6"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Чекаат ажурирање
              </p>

              {loading ? (
                <Loader2
                  className="animate-spin mt-3"
                  size={24}
                  style={{ color: "#f59e0b" }}
                />
              ) : (
                <p className="text-3xl font-semibold mt-2 text-amber-600">
                  {stats.pending}
                </p>
              )}
            </div>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#f59e0b10" }}
            >
              <FileText size={22} style={{ color: "#f59e0b" }} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300">
              <Filter size={16} />
              Филтер
            </button>

            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300">
              <Download size={16} />
              Експорт (CSV)
            </button>
          </div>

          <Link
            to="/admin/institutions/add"
            className="no-underline flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: "#0a96f4",
              boxShadow: "0 4px 12px rgba(10, 150, 244, 0.25)",
            }}
          >
            + Додај нова институција
          </Link>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
            Грешка при преземање на податоци: {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2
                className="animate-spin"
                size={36}
                style={{ color: "#0a96f4" }}
              />
            </div>
          ) : paginatedInstitutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
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
            <table className="w-full">
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
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
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
                      {inst.description || "Нема опис"}
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
          )}
        </div>

        {!loading && institutions.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex justify-between items-center">
            <p className="text-gray-500 text-sm font-medium">
              Прикажани {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalCount)} од {totalCount}{" "}
              резултати
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
                Претходна
              </button>

              <span className="px-4 py-2 text-gray-700 font-semibold text-sm">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Следна
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionsPage;
