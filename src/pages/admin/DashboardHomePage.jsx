import { useEffect, useState } from "react";
import {
  Building2,
  BarChart3,
  TrendingUp,
  CircleDollarSign,
  Clock,
  Activity,
} from "lucide-react";
import {
  categoryMap,
  getInstitutions,
  getReports,
} from "../../api/apiService";

const formatDateLabel = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("mk-MK", { month: "short", year: "2-digit" });
};

const createActivityLabel = (item) => {
  const institution = item.institutionName || item.institution || item.category || "непозната институција";
  return item.createdAt
    ? `Нова пријава од ${institution}`
    : item.updatedAt
    ? `Ажурирана пријава за ${institution}`
    : `Пријавa за ${institution}`;
};

const DashboardHomePage = () => {
  const [institutions, setInstitutions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const [institutionsResult, reportsResult] = await Promise.allSettled([
        getInstitutions(),
        getReports(),
      ]);

      if (institutionsResult.status === "fulfilled") {
        setInstitutions(
          Array.isArray(institutionsResult.value)
            ? institutionsResult.value
            : institutionsResult.value?.data || [],
        );
      }

      if (reportsResult.status === "fulfilled") {
        setReports(
          Array.isArray(reportsResult.value)
            ? reportsResult.value
            : reportsResult.value?.data || [],
        );
      }

      if (institutionsResult.status === "rejected" || reportsResult.status === "rejected") {
        setError("Не можевме да ја вчитаме аналитиката. Проверете ја backend поврзаноста.");
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const totalInstitutions = institutions.length;
  const totalSubmissions = reports.length;

  const categoryBuckets = institutions.reduce((acc, item) => {
    const key = item.category || item.type || item.name || "Останато";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryBuckets).map(([key, value]) => ({
    name: categoryMap[key]?.label || key,
    value,
  }));

  const maxCategoryValue = Math.max(...categoryData.map((item) => item.value), 1);

  const monthBuckets = {};
  institutions.forEach((item) => {
    const label = formatDateLabel(item.createdAt || item.date);
    if (!label) return;
    monthBuckets[label] = monthBuckets[label] || { institutions: 0, submissions: 0 };
    monthBuckets[label].institutions += 1;
  });

  reports.forEach((item) => {
    const label = formatDateLabel(item.createdAt || item.date);
    if (!label) return;
    monthBuckets[label] = monthBuckets[label] || { institutions: 0, submissions: 0 };
    monthBuckets[label].submissions += 1;
  });

  const lineData = Object.entries(monthBuckets)
    .map(([label, value]) => ({ label, ...value }))
    .sort((a, b) => new Date(a.label) - new Date(b.label));

  const activeReports = reports.filter(
    (item) => item.status === "IN_PROGRESS" || item.status === "ASSIGNED",
  ).length;
  const pendingReports = reports.filter((item) => item.status === "OPEN" || item.status === "ASSIGNED").length;
  const inactiveReports = reports.filter((item) => item.status === "RESOLVED").length;
  const statusTotal = Math.max(reports.length, 1);

  const statusData = [
    {
      label: "Активни",
      value: reports.length ? Math.round((activeReports / statusTotal) * 100) : 0,
      color: "#0a96f4",
    },
    {
      label: "Чека",
      value: reports.length ? Math.round((pendingReports / statusTotal) * 100) : 0,
      color: "#38bdf8",
    },
    {
      label: "Неактивни",
      value: reports.length ? Math.round((inactiveReports / statusTotal) * 100) : 0,
      color: "#c7d2fe",
    },
  ];

  const recentActivity = reports
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
    .slice(0, 3)
    .map((item) => ({
      title: createActivityLabel(item),
      detail: item.institutionName || item.category || item.title || "Нема детали",
      time:
        item.createdAt || item.updatedAt
          ? new Date(item.createdAt || item.updatedAt).toLocaleDateString("mk-MK", {
              day: "numeric",
              month: "short",
            })
          : "—",
    }));

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 mx-auto h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Се вчитуваат аналитички податоци...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-6 md:p-8 shadow-[0_18px_60px_rgb(15,23,42,0.06)] border border-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Аналитика</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Аналитика заснована на реални backend податоци од институции, барања и корисници.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-[#0a96f4]/10 px-4 py-3 text-sm font-semibold text-[#0a96f4]">
            <CircleDollarSign size={18} /> Живи податоци
          </div>
        </div>

        <div className="grid gap-4 mt-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Вкупни институции",
              value: totalInstitutions,
              accent: "bg-[#0a96f4]",
              icon: Building2,
              note: "API /api/institutions",
            },
              {
              title: "Вкупно поднесувања",
              value: totalSubmissions,
              accent: "bg-[#0a96f4]/10 text-[#0a96f4]",
              icon: Activity,
              note: "API /api/reports",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[26px] border border-slate-100 bg-slate-50/80 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {item.title}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.accent}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">{item.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgb(15,23,42,0.06)] border border-gray-100">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Институции по категорија</h2>
              <p className="mt-1 text-sm text-slate-500">Групирање според категоријата од backend податоците.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#0a96f4]/10 px-3 py-1 text-sm font-semibold text-[#0a96f4]">
              Бар график
            </span>
          </div>

          {categoryData.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              Нема доволно податоци за категориите.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-slate-700">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0a96f4]"
                      style={{ width: `${(item.value / maxCategoryValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6">
          <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgb(15,23,42,0.06)] border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Активност со текот на времето</h2>
                <p className="mt-1 text-sm text-slate-500">Нови институции и поднесувања од реалниот backend.</p>
              </div>
              <TrendingUp size={20} className="text-[#0a96f4]" />
            </div>

            {lineData.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                Нема доволно временски податоци.
              </div>
            ) : (
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-slate-200" />
                <div className="absolute inset-x-0 top-1/4 h-[1px] bg-slate-200" />
                <div className="absolute inset-x-0 top-2/4 h-[1px] bg-slate-200" />
                <div className="absolute inset-x-0 top-3/4 h-[1px] bg-slate-200" />

                <div className="relative flex items-end justify-between gap-3 h-full">
                  {lineData.map((point) => {
                    const height = 30 + (point.submissions + point.institutions) * 1.2;
                    return (
                      <div key={point.label} className="relative flex h-full w-full flex-col items-center justify-end gap-3 text-sm text-slate-500">
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200" />
                        <div className="relative flex h-full w-full items-end justify-center">
                          <div className="absolute bottom-0 left-1/2 h-full w-0.5 bg-slate-200" style={{ transform: "translateX(-50%)" }} />
                          <div className="absolute bottom-0 left-1/2 h-[6px] w-[6px] rounded-full bg-[#0a96f4] shadow-[0_0_0_8px_rgba(10,150,244,0.08)]" style={{ transform: `translateX(-50%) translateY(-${Math.min(height, 180) - 24}px)` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{point.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgb(15,23,42,0.06)] border border-gray-100">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Преглед на статуси</h2>
                <p className="mt-1 text-sm text-slate-500">Реален распоред според статусите од backend.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#0a96f4]/10 px-3 py-1 text-sm font-semibold text-[#0a96f4]">
                Донат
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                Нема поднесувања за да се прикаже статус.
              </div>
            ) : (
              <div className="relative flex items-center justify-center py-6">
                <div className="h-44 w-44 rounded-full bg-[conic-gradient(at_top,_#0a96f4_0%,_#0a96f4_64%,_#38bdf8_64%,_#38bdf8_82%,_#c7d2fe_82%,_#c7d2fe_100%)]" />
                <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-white shadow-sm" />
              </div>
            )}

            <div className="grid gap-3 mt-4">
              {statusData.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgb(15,23,42,0.06)] border border-gray-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Најнова активност</h2>
            <p className="mt-1 text-sm text-slate-500">Последни настани повлечени директно од backend.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0a96f4]/10 px-4 py-2 text-sm font-semibold text-[#0a96f4]">
            <Clock size={16} /> Ажурирано неодамна
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Нема доволно recent активности од backend.
          </div>
        ) : (
          <div className="grid gap-3">
            {recentActivity.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-3xl border border-gray-100 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-[32px] border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default DashboardHomePage;
