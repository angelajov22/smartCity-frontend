import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  Filter,
  MapPin,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  X,
  ChevronDown,
  Activity,
  Loader2,
  Bot,
} from "lucide-react";
import {
  getReports,
  deleteReport,
  updateReport,
  updateReportStatus,
  createReport,
  categoryMap,
  statusMap,
} from "../api/apiService";
import { formatDescriptionParts } from "../utils/formatDescription";

const statusConfig = {
  "Во тек": {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  Нов: {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  Решен: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
};

const getDisplayStatus = (apiStatus) => {
  return statusMap[apiStatus]?.label || apiStatus;
};

const getDisplayCategory = (apiCategory) => {
  return categoryMap[apiCategory]?.label || apiCategory;
};

const ITEMS_PER_PAGE = 4;

export default function AdminCases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getReports();
      setCases(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Не можевме да ги вчитаме пријавите. Обидете се повторно.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const filteredCases = cases.filter((c) => {
    const desc = (c.description || "").toLowerCase();
    const id = String(c.id || "");
    const inst = (c.institutionName || "").toLowerCase();

    const matchesSearch =
      desc.includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery.toLowerCase()) ||
      inst.includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || c.category === categoryFilter;

    const matchesStatus =
      statusFilter === "" ||
      c.status === statusFilter ||
      (statusFilter === "OPEN" && c.status === "ASSIGNED");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Дали сте сигурни дека сакате да го избришете овој случај?",
      )
    ) {
      try {
        await deleteReport(id);
        setCases((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Бришењето не успеа. Обидете се повторно.");
      }
    }
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowAddModal(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);

    try {
      if (editingCase) {
        await updateReport(editingCase.id, {
          description: formData.description,
          category: formData.category,
          status: formData.status,
        });

        if (formData.status && formData.status !== editingCase.status) {
          await updateReportStatus(editingCase.id, formData.status);
        }

        setCases((prev) =>
          prev.map((c) =>
            c.id === editingCase.id
              ? {
                  ...c,
                  description: formData.description,
                  category: formData.category,
                  status: formData.status,
                }
              : c,
          ),
        );
      } else {
        const created = await createReport({
          description: formData.description,
          category: formData.category,
          latitude: formData.latitude || 42.0,
          longitude: formData.longitude || 21.43,
        });

        setCases((prev) => [created, ...prev]);
      }

      setShowAddModal(false);
      setEditingCase(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Зачувувањето не успеа. Обидете се повторно.");
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (filteredCases.length === 0) {
      alert("Нема податоци за извоз.");
      return;
    }

    const headers = [
      "ID",
      "Опис",
      "Категорија",
      "Институција",
      "Статус",
      "Координати",
    ];

    const rows = filteredCases.map((c) => [
      c.id,
      `"${(c.description || "").replace(/"/g, '""')}"`,
      getDisplayCategory(c.category),
      `"${(c.institutionName || "").replace(/"/g, '""')}"`,
      getDisplayStatus(c.status),
      `"${c.latitude?.toFixed(4) || ""}, ${c.longitude?.toFixed(4) || ""}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mojgrad_slucaevi_${new Date().toISOString().split("T")[0]}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fe] font-sans relative">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between sticky top-0 z-30 shadow-sm gap-4 px-4 py-4 lg:px-10 lg:py-0 lg:h-20">
        <h5 className="text-[17px] lg:text-[19px] font-extrabold text-gray-900 leading-tight tracking-tight lg:w-[300px]">
          Администраторски преглед на
          <br />
          <span className="text-blue-600">случаи</span>
        </h5>

        <div className="w-full lg:max-w-[500px] lg:flex-1 lg:mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />

            <input
              type="text"
              placeholder="Пребарај случаи по ID или наслов..."
              className="w-full bg-gray-50/50 border border-gray-200/50 rounded-2xl text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner py-3 pl-11 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6 lg:w-[300px] lg:justify-end">
          <button className="relative w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm flex-shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button
            onClick={() => {
              setEditingCase(null);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-1.5 text-[11px] lg:text-[12px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all uppercase tracking-wide shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 px-3 py-2.5 lg:px-5 lg:py-3 flex-none whitespace-nowrap"
          >
            <Plus className="w-3 h-3 lg:w-3.5 lg:h-3.5" strokeWidth={3} />
            ДОДАДИ ПРОБЛЕМ
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-500 font-medium">
              Се вчитуваат пријавите...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>

            <button
              onClick={fetchReports}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Обиди се повторно
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 mb-8 lg:mb-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
              <StatCard
                icon={FileText}
                iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
                iconColor="text-white"
                accentColor="bg-blue-500"
                tag="Вкупно"
                value={cases.length.toString()}
                label="Вкупно пријави"
                subLabel={`${cases.length} во системот`}
                subLabelColor="text-green-500"
              />

              <StatCard
                icon={Clock}
                iconBg="bg-gradient-to-br from-amber-50 to-amber-100"
                iconColor="text-amber-500"
                accentColor="bg-amber-400"
                tag="Нови"
                value={cases
                  .filter((c) => c.status === "OPEN" || c.status === "ASSIGNED")
                  .length.toString()}
                label="Нови случаи"
                subLabel="Потребна акција"
                subLabelColor="text-amber-500"
              />

              <StatCard
                icon={Clock}
                iconBg="bg-gradient-to-br from-purple-50 to-purple-100"
                iconColor="text-purple-500"
                accentColor="bg-purple-500"
                tag="Во тек"
                value={cases
                  .filter((c) => c.status === "IN_PROGRESS")
                  .length.toString()}
                label="Во решавање"
                subLabel="Се работи на нив"
                subLabelColor="text-gray-400"
              />

              <StatCard
                icon={CheckCircle2}
                iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
                iconColor="text-emerald-500"
                accentColor="bg-emerald-500"
                tag="Завршени"
                value={cases
                  .filter((c) => c.status === "RESOLVED")
                  .length.toString()}
                label="Решени"
                subLabel="Успешно завршени"
                subLabelColor="text-emerald-500"
              />
            </div>

            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8 lg:mb-10">
              <div className="flex flex-col border-b border-gray-100 bg-white p-4 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h2 className="text-[18px] lg:text-[19px] font-extrabold text-gray-900 mb-1.5">
                      Листа на сите случаи
                    </h2>

                    <p className="text-[13px] lg:text-[14px] font-medium text-gray-500">
                      Управувајте со пријавените проблеми и менувајте ги нивните
                      статуси.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center justify-center gap-2 text-[14px] font-bold transition-all rounded-xl ${
                        showFilters
                          ? "bg-blue-50 text-blue-600 border-blue-200 shadow-inner"
                          : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                      } border px-5 py-2.5`}
                    >
                      <Filter className="w-4 h-4" />
                      Филтрирај
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={exportToCSV}
                      className="text-[14px] font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm px-5 py-2.5"
                    >
                      Export (CSV)
                    </button>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showFilters
                      ? "max-h-[220px] mt-6 opacity-100"
                      : "max-h-0 mt-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-gray-100/80">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white border border-gray-200/80 font-medium text-[13px] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-700 shadow-sm px-5 py-2.5"
                    >
                      <option value="">Сите категории</option>

                      {Object.entries(categoryMap).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-gray-200/80 font-medium text-[13px] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-700 shadow-sm px-5 py-2.5"
                    >
                      <option value="">Сите статуси</option>
                      <option value="OPEN">Нов</option>
                      <option value="IN_PROGRESS">Во тек</option>
                      <option value="RESOLVED">Решен</option>
                    </select>

                    <button
                      onClick={clearFilters}
                      className="text-[13px] text-gray-500 hover:text-red-500 font-bold sm:ml-auto transition-colors px-4 py-2 rounded-xl hover:bg-red-50 text-left"
                    >
                      Исчисти филтри
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-gray-100">
                      <th className="text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[8%]">
                        ID
                      </th>
                      <th className="text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[30%]">
                        Опис и Категорија
                      </th>
                      <th className="text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[18%]">
                        Институција
                      </th>
                      <th className="text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[14%]">
                        Статус
                      </th>
                      <th className="text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[15%]">
                        Координати
                      </th>
                      <th className="text-right text-[12px] font-bold text-gray-500 uppercase tracking-wider px-8 py-4 w-[15%]">
                        Акции
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCases
                      .slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE,
                      )
                      .map((caseItem, index) => {
                        const displayStatus = getDisplayStatus(caseItem.status);
                        const s =
                          statusConfig[displayStatus] || statusConfig["Нов"];

                        return (
                          <tr
                            key={caseItem.id || index}
                            className="border-b border-gray-50 hover:bg-[#f8fafc]/80 transition-all duration-200 group"
                          >
                            <td className="px-8 py-6">
                              <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[13px] font-bold border border-blue-100/50">
                                #{caseItem.id}
                              </span>
                            </td>

                            <td className="px-8 py-6 pr-5">
                              <div className="space-y-2">
                                <div className="bg-gray-50  rounded-xl px-3 py-2 space-y-2 group-hover:border-blue-100 group-hover:bg-blue-50/20 transition-all max-w-[420px]">
                                  {caseItem.description ? (
                                    (() => {
                                      const descriptionParts =
                                        formatDescriptionParts(
                                          caseItem.description,
                                        );

                                      return (
                                        <>
                                          {descriptionParts.userReport && (
                                            <div>
                                              <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-gray-400 mb-1">
                                                {descriptionParts.userLabel}
                                              </p>

                                              <p className="text-[12px] font-medium text-gray-700 leading-snug line-clamp-2">
                                                {descriptionParts.userReport}
                                              </p>
                                            </div>
                                          )}

                                          {descriptionParts.aiVision && (
                                            <div className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2">
                                              <div className="flex items-center gap-1.5 mb-1">
                                                <Bot
                                                  size={12}
                                                  className="text-[#0a96f4] flex-shrink-0"
                                                />

                                                <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#0a96f4]">
                                                  {descriptionParts.aiLabel}
                                                </p>
                                              </div>

                                              <p className="text-[11px] text-gray-700 leading-snug line-clamp-2">
                                                {descriptionParts.aiVision}
                                              </p>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()
                                  ) : (
                                    <p className="text-[12px] italic text-gray-400">
                                      Нема опис.
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        categoryMap[caseItem.category]?.color ||
                                        "#6b7280",
                                    }}
                                  ></div>

                                  <p className="text-[12px] font-medium text-gray-500">
                                    {getDisplayCategory(caseItem.category)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>

                                <span className="text-[13px] font-bold text-gray-700">
                                  {caseItem.institutionName || "—"}
                                </span>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold border ${s.bg} ${s.text} ${s.border}`}
                              >
                                {s.icon}
                                {displayStatus}
                              </span>
                            </td>

                            <td className="px-8 py-6">
                              <span className="text-[12px] font-mono font-semibold text-gray-400">
                                {caseItem.latitude?.toFixed(4)},{" "}
                                {caseItem.longitude?.toFixed(4)}
                              </span>
                            </td>

                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEdit(caseItem)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Промени
                                </button>

                                <button
                                  onClick={() => handleDelete(caseItem.id)}
                                  className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm hover:shadow"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                    {filteredCases.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-16 text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Search className="w-6 h-6 text-gray-400" />
                            </div>

                            <p className="text-[15px] font-bold text-gray-800">
                              Нема пронајдено случаи
                            </p>

                            <p className="text-[13px] font-medium text-gray-500 mt-1">
                              Обидете се со други филтри или параметри.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden bg-[#f8fafc] p-4">
                <div className="flex flex-col gap-4">
                  {filteredCases
                    .slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE,
                    )
                    .map((caseItem, index) => {
                      const displayStatus = getDisplayStatus(caseItem.status);
                      const s =
                        statusConfig[displayStatus] || statusConfig["Нов"];

                      return (
                        <div
                          key={caseItem.id || index}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[12px] font-bold border border-blue-100/50">
                              #{caseItem.id}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold border ${s.bg} ${s.text} ${s.border}`}
                            >
                              {s.icon}
                              {displayStatus}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="bg-gray-50  rounded-xl px-3 py-2 space-y-2">
                              {caseItem.description ? (
                                (() => {
                                  const descriptionParts =
                                    formatDescriptionParts(
                                      caseItem.description,
                                    );

                                  return (
                                    <>
                                      {descriptionParts.userReport && (
                                        <div>
                                          <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-gray-400 mb-1">
                                            {descriptionParts.userLabel}
                                          </p>

                                          <p className="text-[11px] font-medium text-gray-700 leading-snug line-clamp-2">
                                            {descriptionParts.userReport}
                                          </p>
                                        </div>
                                      )}

                                      {descriptionParts.aiVision && (
                                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Bot
                                              size={11}
                                              className="text-[#0a96f4] flex-shrink-0"
                                            />

                                            <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#0a96f4]">
                                              {descriptionParts.aiLabel}
                                            </p>
                                          </div>

                                          <p className="text-[10px] text-gray-700 leading-snug line-clamp-2">
                                            {descriptionParts.aiVision}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()
                              ) : (
                                <p className="text-[11px] italic text-gray-400">
                                  Нема опис.
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    categoryMap[caseItem.category]?.color ||
                                    "#6b7280",
                                }}
                              ></div>

                              <p className="text-[12px] font-semibold text-gray-500">
                                {getDisplayCategory(caseItem.category)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-[12px]">
                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-gray-400 uppercase">
                                  Институција
                                </p>
                                <p className="font-bold text-gray-700 truncate">
                                  {caseItem.institutionName || "—"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2">
                              <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase">
                                  Координати
                                </p>
                                <p className="font-mono font-semibold text-gray-500">
                                  {caseItem.latitude?.toFixed(4)},{" "}
                                  {caseItem.longitude?.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleEdit(caseItem)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[13px] font-bold text-blue-600 hover:bg-blue-100 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Промени
                            </button>

                            <button
                              onClick={() => handleDelete(caseItem.id)}
                              className="w-11 h-11 flex items-center justify-center bg-red-50 border border-red-100 rounded-xl text-red-500 hover:bg-red-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {filteredCases.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>

                      <p className="text-[15px] font-bold text-gray-800">
                        Нема пронајдено случаи
                      </p>

                      <p className="text-[13px] font-medium text-gray-500 mt-1">
                        Обидете се со други филтри или параметри.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {(() => {
                const totalPages = Math.max(
                  1,
                  Math.ceil(filteredCases.length / ITEMS_PER_PAGE),
                );

                const startItem =
                  filteredCases.length === 0
                    ? 0
                    : (currentPage - 1) * ITEMS_PER_PAGE + 1;

                const endItem = Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredCases.length,
                );

                const getPageNumbers = () => {
                  const pages = [];

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);

                    if (currentPage > 3) pages.push("...");

                    for (
                      let i = Math.max(2, currentPage - 1);
                      i <= Math.min(totalPages - 1, currentPage + 1);
                      i++
                    ) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 2) pages.push("...");

                    pages.push(totalPages);
                  }

                  return pages;
                };

                return (
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-t border-gray-100 bg-white px-4 lg:px-8 py-5">
                    <p className="text-[13px] font-medium text-gray-500">
                      Прикажани{" "}
                      <span className="font-bold text-gray-900">
                        {startItem}–{endItem}
                      </span>{" "}
                      од вкупно{" "}
                      <span className="font-bold text-gray-900">
                        {filteredCases.length}
                      </span>{" "}
                      случаи
                    </p>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className={`text-[13px] font-bold transition-colors px-4 py-2 ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Претходна
                        </button>

                        {getPageNumbers().map((page, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              typeof page === "number" && setCurrentPage(page)
                            }
                            disabled={page === "..."}
                            className={`text-[13px] font-bold w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                              page === currentPage
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                : page === "..."
                                  ? "text-gray-400 cursor-default"
                                  : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className={`text-[13px] font-bold transition-colors px-4 py-2 ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          Следна
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-8">
              <div className="bg-white rounded-[24px] p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>

                    <h3 className="text-[16px] font-extrabold text-gray-900">
                      Последна активност
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:gap-6 relative">
                  <div className="absolute left-5 lg:left-6 top-6 bottom-6 w-px bg-gray-100 -z-10"></div>

                  {cases.length === 0 && (
                    <p className="text-[14px] text-gray-400 text-center py-4">
                      Нема активности
                    </p>
                  )}

                  {cases
                    .slice(-5)
                    .reverse()
                    .map((report) => {
                      const catInfo = categoryMap[report.category] || {
                        label: report.category,
                        color: "#6b7280",
                      };

                      const statusLabel =
                        statusMap[report.status]?.label || report.status;

                      return (
                        <div
                          key={report.id}
                          className="flex gap-3 lg:gap-4 items-start min-w-0"
                        >
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                            <div
                              className="w-full h-full rounded-full flex items-center justify-center"
                              style={{ backgroundColor: catInfo.color + "18" }}
                            >
                              <span
                                className="text-[12px] lg:text-[14px] font-bold"
                                style={{ color: catInfo.color }}
                              >
                                #{report.id}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1 min-w-0 flex-1">
                            <p className="text-[14px] text-gray-800 font-medium truncate">
                              {report.institutionName || "Систем"} —{" "}
                              <span className="text-gray-500">
                                {statusLabel}
                              </span>
                            </p>

                            <p className="text-[12px] text-gray-500 mt-1 break-words">
                              {report.description}
                            </p>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span
                                className="inline-block px-2 py-0.5 rounded text-[11px] font-bold"
                                style={{
                                  backgroundColor: catInfo.color + "18",
                                  color: catInfo.color,
                                }}
                              >
                                {catInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {(() => {
                const newCount = cases.filter(
                  (c) => c.status === "OPEN" || c.status === "ASSIGNED",
                ).length;

                const inProgressCount = cases.filter(
                  (c) => c.status === "IN_PROGRESS",
                ).length;

                const resolvedCount = cases.filter(
                  (c) => c.status === "RESOLVED",
                ).length;

                const categoryCounts = {};

                cases.forEach((c) => {
                  const label = categoryMap[c.category]?.label || c.category;
                  categoryCounts[label] = (categoryCounts[label] || 0) + 1;
                });

                const topCategories = Object.entries(categoryCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3);

                const hasCritical = newCount > 0;

                return (
                  <div className="bg-gradient-to-br from-blue-50 to-[#e0f2fe] rounded-[24px] p-4 lg:p-8 relative overflow-hidden border border-blue-100 flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-5 lg:mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>

                        <h3 className="text-[15px] lg:text-[16px] font-extrabold text-[#0369a1] leading-tight">
                          Системски известувања
                        </h3>
                      </div>

                      {hasCritical ? (
                        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-5 lg:p-6 mb-4 shadow-sm border border-white">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] lg:text-[11px] font-bold uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            ПОТРЕБНА АКЦИЈА
                          </span>

                          <p className="text-[14px] lg:text-[15px] font-bold text-[#0f172a] leading-relaxed">
                            Имате{" "}
                            <span className="text-blue-600 text-[20px] lg:text-[18px]">
                              {newCount}
                            </span>{" "}
                            нов{newCount === 1 ? "а пријава" : "и пријави"} кои
                            чекаат обработка.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-5 lg:p-6 mb-4 shadow-sm border border-white">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] lg:text-[11px] font-bold uppercase tracking-wider mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            СÈ Е ВО РЕД
                          </span>

                          <p className="text-[14px] lg:text-[15px] font-bold text-[#0f172a] leading-relaxed">
                            Нема итни пријави кои чекаат обработка.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-4">
                        <div className="bg-white/75 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center border border-white/80">
                          <p className="text-[20px] lg:text-[22px] font-extrabold text-blue-600">
                            {inProgressCount}
                          </p>

                          <p className="text-[12px] font-semibold text-gray-500 mt-1">
                            Во тек
                          </p>
                        </div>

                        <div className="bg-white/75 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center border border-white/80">
                          <p className="text-[20px] lg:text-[22px] font-extrabold text-emerald-600">
                            {resolvedCount}
                          </p>

                          <p className="text-[12px] font-semibold text-gray-500 mt-1">
                            Решени
                          </p>
                        </div>
                      </div>

                      {topCategories.length > 0 && (
                        <div className="bg-white/65 backdrop-blur-sm rounded-xl p-4 border border-white/80 flex-1">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Најчести категории
                          </p>

                          <div className="flex flex-col gap-2">
                            {topCategories.map(([label, count]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between gap-4"
                              >
                                <span className="text-[13px] font-medium text-gray-700 truncate">
                                  {label}
                                </span>

                                <span className="text-[13px] font-bold text-blue-600 flex-shrink-0">
                                  {count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowAddModal(false);
              setEditingCase(null);
            }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">
                  {editingCase ? "Промени случај" : "Додади нов случај"}
                </h2>

                <p className="text-[13px] text-gray-500 mt-1">
                  {editingCase
                    ? "Ажурирајте ги деталите за овој случај"
                    : "Внесете ги потребните информации за новиот проблем"}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCase(null);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target);

                handleSave({
                  description: formData.get("description"),
                  category: formData.get("category"),
                  status: formData.get("status"),
                  latitude: parseFloat(formData.get("latitude")) || 42.0,
                  longitude: parseFloat(formData.get("longitude")) || 21.43,
                });
              }}
              className="p-6 flex flex-col gap-5 bg-gray-50/50"
            >
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Опис на проблемот
                </label>

                <textarea
                  name="description"
                  defaultValue={editingCase?.description || ""}
                  required
                  minLength={5}
                  maxLength={2000}
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all resize-none"
                  placeholder="Опишете го проблемот детално..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Категорија
                  </label>

                  <select
                    name="category"
                    defaultValue={editingCase?.category || "ROAD"}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all appearance-none"
                  >
                    {Object.entries(categoryMap).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    Статус
                  </label>

                  <select
                    name="status"
                    defaultValue={
                      (editingCase?.status === "ASSIGNED"
                        ? "OPEN"
                        : editingCase?.status) || "OPEN"
                    }
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all appearance-none"
                  >
                    <option value="OPEN">Нов</option>
                    <option value="IN_PROGRESS">Во тек</option>
                    <option value="RESOLVED">Решен</option>
                  </select>
                </div>
              </div>

              {!editingCase && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      Геогр. ширина (Lat)
                    </label>

                    <input
                      name="latitude"
                      type="number"
                      step="0.0001"
                      defaultValue="42.0000"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      Геогр. должина (Lng)
                    </label>

                    <input
                      name="longitude"
                      type="number"
                      step="0.0001"
                      defaultValue="21.4300"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCase(null);
                  }}
                  className="px-5 py-2.5 text-[14px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                >
                  Откажи
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-[14px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}

                  {saving
                    ? "Се зачувува..."
                    : editingCase
                      ? "Зачувај промени"
                      : "Додади случај"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  accentColor,
  tag,
  value,
  label,
  subLabel,
  subLabelColor,
}) {
  return (
    <div className="relative bg-white rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md border border-gray-100/80 overflow-hidden group h-[155px] lg:h-[220px] p-4 lg:py-6 lg:pr-7 lg:pl-9 min-w-[220px] snap-start lg:min-w-0">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          accentColor || "bg-blue-500"
        } rounded-l-2xl`}
      />

      <div
        className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-[0.04] ${
          accentColor || "bg-blue-500"
        } group-hover:opacity-[0.07] transition-opacity duration-500`}
      />

      <div className="flex items-center justify-between">
        <div
          className={`w-9 h-9 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon
            className={`w-4 h-4 lg:w-5 lg:h-5 ${iconColor}`}
            strokeWidth={2}
          />
        </div>

        <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {tag}
        </span>
      </div>

      <p className="text-[26px] lg:text-[36px] font-extrabold text-gray-900 leading-none tracking-tight">
        {value}
      </p>

      <div>
        <p className="text-[12px] lg:text-[14px] font-semibold text-gray-700 leading-tight">
          {label}
        </p>

        <p
          className={`text-[11px] lg:text-[12px] font-medium mt-0.5 lg:mt-1 leading-tight ${subLabelColor}`}
        >
          {subLabel}
        </p>
      </div>
    </div>
  );
}
