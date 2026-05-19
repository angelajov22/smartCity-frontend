import { useEffect, useState } from "react";
import { FileText, ArrowRight } from "lucide-react";
import { getReports } from "../../api/apiService";

const statusConfig = {
  OPEN: { label: "Нов", color: "bg-blue-50 text-blue-700" },
  ASSIGNED: { label: "Доделено", color: "bg-amber-50 text-amber-700" },
  IN_PROGRESS: { label: "Во тек", color: "bg-amber-50 text-amber-700" },
  RESOLVED: { label: "Решено", color: "bg-emerald-50 text-emerald-700" },
  COMPLETED: { label: "Завршено", color: "bg-slate-50 text-slate-700" },
  REJECTED: { label: "Отфрлено", color: "bg-red-50 text-red-700" },
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReports();
        if (!Array.isArray(data)) {
          throw new Error("Неочекуван одговор од серверот за поднесувања.");
        }
        setSubmissions(data);
      } catch (err) {
        setError(err.message || "Не можеме да ги поврзаме податоците за поднесувањата.");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const uniqueTypes = Array.from(
    new Set(submissions.map((item) => item.category).filter(Boolean)),
  );
  const newCount = submissions.filter((item) => item.status === "OPEN").length;
  const inProgressCount = submissions.filter(
    (item) => item.status === "IN_PROGRESS" || item.status === "ASSIGNED",
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Поднесувања</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Преглед на сите поднесувања со статус и датум, повлечени од backend.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0a96f4]/10 px-4 py-2 text-sm font-semibold text-[#0a96f4]">
            <FileText size={16} /> Живо вчитување
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-[32px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Наслов
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Институција
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Категорија
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Статус
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Датум
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Се вчитуваат поднесувањата...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No submissions found.
                </td>
              </tr>
            ) : (
              submissions.map((item, index) => {
                const status = statusConfig[item.status] || { label: item.status || "Непознат", color: "bg-slate-50 text-slate-700" };
                return (
                  <tr key={`${item.title ?? "submission"}-${index}`} className="transition-all hover:bg-slate-50/80">
                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      {item.description ? item.description : `Пријава #${item.id}`}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {item.institutionName || item.institution || "-"}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {item.category || "-"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{formatDate(item.createdAt)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-[32px] bg-[#eff6ff] p-6 sm:p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] border border-blue-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Краток преглед</h2>
            <p className="mt-2 text-sm text-slate-600">
              Преглед на основните типови поднесувања и нивните статусы за побрза контрола.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a96f4] shadow-sm">
            <ArrowRight size={16} /> Брз увид
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Типови</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{uniqueTypes.length}</p>
            <p className="mt-2 text-sm text-slate-500">Различни видови поднесувања</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Нови</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{newCount}</p>
            <p className="mt-2 text-sm text-slate-500">Чекаат преглед</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Во тек</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{inProgressCount}</p>
            <p className="mt-2 text-sm text-slate-500">Активни случаи</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
