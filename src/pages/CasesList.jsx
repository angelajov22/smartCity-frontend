import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getReports, categoryMap, statusMap } from "../api/apiService";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";

function CasesList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Сите категории");
  const [statusFilter, setStatusFilter] = useState("Сите статуси");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getReports();
        // Sort descending by ID or date so newest are first
        const sortedData = data.sort((a, b) => b.id - a.id);
        setCases(sortedData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCases = cases.filter((item) => {
    const search = searchTerm.toLowerCase();

    const desc = item.description ? item.description.toLowerCase() : "";
    const inst = item.institutionName ? item.institutionName.toLowerCase() : "";
    
    const catLabel = categoryMap[item.category]?.label || item.category;
    const statLabel = statusMap[item.status]?.label || item.status;

    const matchesSearch =
      desc.includes(search) ||
      inst.includes(search) ||
      (catLabel && catLabel.toLowerCase().includes(search));

    const matchesCategory =
      categoryFilter === "Сите категории" || catLabel === categoryFilter;

    // Treat OPEN and ASSIGNED as "Нов" based on statusMap
    let currentStatusLabel = statLabel;
    if (item.status === "OPEN" || item.status === "ASSIGNED") {
      currentStatusLabel = "Нов";
    }
    
    const matchesStatus =
      statusFilter === "Сите статуси" || currentStatusLabel === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCases = cases.length;
  const activeCases = cases.filter((item) => item.status === "IN_PROGRESS" || item.status === "OPEN" || item.status === "ASSIGNED").length;
  const solvedCases = cases.filter((item) => item.status === "RESOLVED").length;

  function clearFilters() {
    setSearchTerm("");
    setCategoryFilter("Сите категории");
    setStatusFilter("Сите статуси");
  }

  return (
    <div className="!min-h-screen !bg-gray-100">
      <MainNavbar />

      <main className="!max-w-7xl !mx-auto !px-10 !py-8">
        <header className="!flex !justify-between !items-center !mb-8">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="!w-[520px] !border !rounded-xl !px-5 !py-3 !outline-none"
            placeholder="Пребарај случаи според наслов или институција..."
          />

          <Link
            to="/report"
            className="!font-semibold !bg-white !border !px-5 !py-3 !rounded-xl hover:!bg-gray-50 !text-blue-600 !no-underline"
          >
            + Нова пријава
          </Link>
        </header>

        <h2 className="!text-3xl !font-bold !text-gray-900">Листа на случаи</h2>

        <p className="!text-gray-500 !mt-2 !mb-8">
          Транспарентен преглед на сите граѓански пријави и нивниот тековен статус.
        </p>

        <section className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6 !mb-8">
          <div className="!bg-white !rounded-2xl !p-6 !shadow-sm !flex !justify-between !items-start !border !border-gray-100">
            <div>
              <div className="!w-12 !h-12 !rounded-xl !bg-blue-100 !flex !items-center !justify-center !text-2xl !mb-4">
                📄
              </div>
              <p className="!font-bold !text-lg !text-gray-900">Вкупно пријави</p>
              <p className="!text-gray-500 !text-sm !mt-1">Вкупен број на примени случаи</p>
            </div>
            <p className="!text-4xl !font-bold !text-gray-900">{totalCases}</p>
          </div>

          <div className="!bg-white !rounded-2xl !p-6 !shadow-sm !flex !justify-between !items-start !border !border-gray-100">
            <div>
              <div className="!w-12 !h-12 !rounded-xl !bg-yellow-100 !flex !items-center !justify-center !text-2xl !mb-4">
                ⏱
              </div>
              <p className="!font-bold !text-lg !text-gray-900">Во тек</p>
              <p className="!text-gray-500 !text-sm !mt-1">Случаи кои се обработуваат</p>
            </div>
            <p className="!text-4xl !font-bold !text-gray-900">{activeCases}</p>
          </div>

          <div className="!bg-white !rounded-2xl !p-6 !shadow-sm !flex !justify-between !items-start !border !border-gray-100">
            <div>
              <div className="!w-12 !h-12 !rounded-xl !bg-green-100 !flex !items-center !justify-center !text-2xl !mb-4">
                ✔
              </div>
              <p className="!font-bold !text-lg !text-gray-900">Решени случаи</p>
              <p className="!text-gray-500 !text-sm !mt-1">Успешно затворени пријави</p>
            </div>
            <p className="!text-4xl !font-bold !text-gray-900">{solvedCases}</p>
          </div>
        </section>

        <section className="!bg-white !rounded-2xl !p-5 !mb-8 !flex !gap-4 !items-center !flex-wrap">
          <span className="!font-semibold">Филтрирај според:</span>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2"
          >
            <option>Сите категории</option>
            {Object.values(categoryMap).map((cat, index) => (
              <option key={index} value={cat.label}>{cat.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2"
          >
            <option>Сите статуси</option>
            <option value="Нов">Нов (Пријавено)</option>
            <option value="Во тек">Во тек</option>
            <option value="Решен">Решен</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="!text-gray-500 !font-semibold !bg-transparent !border-0 hover:!text-red-500 transition-colors"
          >
            Исчисти
          </button>
        </section>

        <section className="!bg-white !rounded-2xl !shadow-sm !overflow-hidden">
          <div className="!flex !justify-between !items-center !px-6 !py-5 !border-b">
            <h3 className="!font-bold !text-xl">Сите активни случаи</h3>
          </div>

          <table className="!w-full !text-left">
            <thead className="!bg-gray-50 !text-gray-500 !text-sm">
              <tr>
                <th className="!px-6 !py-4">ID Број</th>
                <th className="!px-6 !py-4">Опис на пријава</th>
                <th className="!px-6 !py-4">Датум</th>
                <th className="!px-6 !py-4">Надлежна институција</th>
                <th className="!px-6 !py-4">Статус</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="!text-center !py-10 !text-gray-500">
                    Се вчитуваат пријавите...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="!text-center !py-10 !text-gray-500">
                    Нема пронајдени случаи.
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => {
                  const displayCat = categoryMap[item.category]?.label || item.category;
                  let displayStatus = statusMap[item.status]?.label || item.status;
                  if (item.status === "OPEN" || item.status === "ASSIGNED") {
                    displayStatus = "Нов";
                  }

                  return (
                    <tr key={item.id} className="!border-t hover:!bg-gray-50 transition-colors">
                      <td className="!px-6 !py-5 !font-semibold !text-gray-600">
                        <Link to={`/case/${item.id}`} className="!text-blue-600 hover:!underline">
                          #{item.id}
                        </Link>
                      </td>
                      <td className="!px-6 !py-5 !max-w-md">
                        <p className="!font-bold !truncate">{item.description}</p>
                        <p className="!text-sm !text-gray-500">{displayCat}</p>
                      </td>
                      <td className="!px-6 !py-5 whitespace-nowrap">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('mk-MK') : "—"}
                      </td>
                      <td className="!px-6 !py-5">{item.institutionName || "—"}</td>
                      <td className="!px-6 !py-5">
                        <span
                          className={`!px-3 !py-1 !rounded-full !text-sm !font-bold ${
                            item.status === "RESOLVED"
                              ? "!bg-green-100 !text-green-600"
                              : item.status === "IN_PROGRESS"
                              ? "!bg-blue-100 !text-blue-600"
                              : "!bg-orange-100 !text-orange-600"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="!px-6 !py-5 !border-t !flex !justify-between !text-gray-500">
            <span>
              Прикажани {filteredCases.length} од {cases.length} случаи
            </span>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}

export default CasesList;