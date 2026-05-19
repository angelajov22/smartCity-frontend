import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

import { getReports, categoryMap, statusMap } from "../api/apiService";
import { formatDescriptionParts } from "../utils/formatDescription";
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

    let currentStatusLabel = statLabel;
    if (item.status === "OPEN" || item.status === "ASSIGNED") {
      currentStatusLabel = "Нов";
    }

    const matchesStatus =
      statusFilter === "Сите статуси" || currentStatusLabel === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCases = cases.length;

  const activeCases = cases.filter(
    (item) =>
      item.status === "IN_PROGRESS" ||
      item.status === "OPEN" ||
      item.status === "ASSIGNED",
  ).length;

  const solvedCases = cases.filter((item) => item.status === "RESOLVED").length;

  function clearFilters() {
    setSearchTerm("");
    setCategoryFilter("Сите категории");
    setStatusFilter("Сите статуси");
  }

  return (
    <div className="!min-h-screen !bg-gray-100">
      <MainNavbar />

      <main className="!max-w-7xl !mx-auto !px-4 sm:!px-6 lg:!px-10 !py-5 sm:!py-8">
        <header className="!flex !justify-between !items-center !mb-6 sm:!mb-8 max-sm:!flex-col max-sm:!items-stretch max-sm:!gap-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="!w-[520px] max-sm:!w-full !border !rounded-xl !px-5 max-sm:!px-4 !py-3 max-sm:!py-2.5 !outline-none max-sm:!text-sm"
            placeholder="Пребарај случаи според наслов или институција..."
          />

          <Link
            to="/report"
            className="!font-semibold !bg-white !border !px-5 !py-3 max-sm:!py-2.5 !rounded-xl hover:!bg-gray-50 !text-blue-600 !no-underline max-sm:!text-center max-sm:!text-sm"
          >
            + Нова пријава
          </Link>
        </header>

        <h2 className="!text-3xl max-sm:!text-2xl !font-bold !text-gray-900">
          Листа на случаи
        </h2>

        <p className="!text-gray-500 !mt-2 !mb-6 sm:!mb-8 max-sm:!text-sm">
          Транспарентен преглед на сите граѓански пријави и нивниот тековен
          статус.
        </p>

        <section className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6 !mb-8 max-sm:!flex max-sm:!overflow-x-auto max-sm:!gap-4 max-sm:!pb-2">
          <div className="!bg-white !rounded-2xl !p-6 max-sm:!p-4 !shadow-sm !flex !justify-between !items-start !border !border-gray-100 max-sm:!min-w-[250px]">
            <div>
              <div className="!w-12 !h-12 max-sm:!w-10 max-sm:!h-10 !rounded-xl !bg-blue-100 !flex !items-center !justify-center !text-2xl max-sm:!text-xl !mb-4">
                📄
              </div>
              <p className="!font-bold !text-lg max-sm:!text-base !text-gray-900">
                Вкупно пријави
              </p>
              <p className="!text-gray-500 !text-sm max-sm:!text-xs !mt-1">
                Вкупен број на примени случаи
              </p>
            </div>
            <p className="!text-4xl max-sm:!text-3xl !font-bold !text-gray-900">
              {totalCases}
            </p>
          </div>

          <div className="!bg-white !rounded-2xl !p-6 max-sm:!p-4 !shadow-sm !flex !justify-between !items-start !border !border-gray-100 max-sm:!min-w-[250px]">
            <div>
              <div className="!w-12 !h-12 max-sm:!w-10 max-sm:!h-10 !rounded-xl !bg-yellow-100 !flex !items-center !justify-center !text-2xl max-sm:!text-xl !mb-4">
                ⏱
              </div>
              <p className="!font-bold !text-lg max-sm:!text-base !text-gray-900">
                Во тек
              </p>
              <p className="!text-gray-500 !text-sm max-sm:!text-xs !mt-1">
                Случаи кои се обработуваат
              </p>
            </div>
            <p className="!text-4xl max-sm:!text-3xl !font-bold !text-gray-900">
              {activeCases}
            </p>
          </div>

          <div className="!bg-white !rounded-2xl !p-6 max-sm:!p-4 !shadow-sm !flex !justify-between !items-start !border !border-gray-100 max-sm:!min-w-[250px]">
            <div>
              <div className="!w-12 !h-12 max-sm:!w-10 max-sm:!h-10 !rounded-xl !bg-green-100 !flex !items-center !justify-center !text-2xl max-sm:!text-xl !mb-4">
                ✔
              </div>
              <p className="!font-bold !text-lg max-sm:!text-base !text-gray-900">
                Решени случаи
              </p>
              <p className="!text-gray-500 !text-sm max-sm:!text-xs !mt-1">
                Успешно затворени пријави
              </p>
            </div>
            <p className="!text-4xl max-sm:!text-3xl !font-bold !text-gray-900">
              {solvedCases}
            </p>
          </div>
        </section>

        <section className="!bg-white !rounded-2xl !p-5 max-sm:!p-4 !mb-8 !flex !gap-4 max-sm:!gap-3 !items-center !flex-wrap max-sm:!flex-col max-sm:!items-stretch">
          <span className="!font-semibold max-sm:!text-sm">
            Филтрирај според:
          </span>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2 max-sm:!w-full max-sm:!text-sm"
          >
            <option>Сите категории</option>
            {Object.values(categoryMap).map((cat, index) => (
              <option key={index} value={cat.label}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2 max-sm:!w-full max-sm:!text-sm"
          >
            <option>Сите статуси</option>
            <option value="Нов">Нов (Пријавено)</option>
            <option value="Во тек">Во тек</option>
            <option value="Решен">Решен</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="!text-gray-500 !font-semibold !bg-transparent !border-0 hover:!text-red-500 transition-colors max-sm:!text-left max-sm:!text-sm"
          >
            Исчисти
          </button>
        </section>

        <section className="!bg-white !rounded-2xl !shadow-sm !overflow-hidden">
          <div className="!flex !justify-between !items-center !px-6 max-sm:!px-4 !py-5 max-sm:!py-4 !border-b">
            <h3 className="!font-bold !text-xl max-sm:!text-lg">
              Сите активни случаи
            </h3>
          </div>

          <div className="!hidden sm:!block !w-full !overflow-x-auto">
            <table className="!w-full !min-w-[950px] !text-left">
              <thead className="!bg-gray-50 !text-gray-500 !text-sm">
                <tr>
                  <th className="!px-6 !py-4">ID Број</th>
                  <th className="!px-6 !py-4">Опис на пријава</th>
                  <th className="!px-6 !py-4">Датум</th>
                  <th className="!px-6 !py-4">Надлежна институција</th>
                  <th className="!px-6 !py-4">Статус</th>
                  <th className="!px-6 !py-4">Детали</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="!text-center !py-10 !text-gray-500"
                    >
                      Се вчитуваат пријавите...
                    </td>
                  </tr>
                ) : filteredCases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="!text-center !py-10 !text-gray-500"
                    >
                      Нема пронајдени случаи.
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((item) => {
                    const displayCat =
                      categoryMap[item.category]?.label || item.category;

                    let displayStatus =
                      statusMap[item.status]?.label || item.status;

                    if (item.status === "OPEN" || item.status === "ASSIGNED") {
                      displayStatus = "Нов";
                    }

                    return (
                      <tr
                        key={item.id}
                        className="!border-t hover:!bg-gray-50 transition-colors"
                      >
                        <td className="!px-6 !py-5 !font-semibold !text-gray-600">
                          #{item.id}
                        </td>

                        <td className="!px-6 !py-5 !max-w-md">
                          <div className="!space-y-2">
                            <div className="!bg-gray-50 !rounded-xl !px-3 !py-2 !space-y-2 !max-w-[420px]">
                              {item.description ? (
                                (() => {
                                  const descriptionParts =
                                    formatDescriptionParts(item.description);

                                  return (
                                    <>
                                      {descriptionParts.userReport && (
                                        <div>
                                          <p className="!text-[9px] !font-extrabold !uppercase !tracking-[0.13em] !text-gray-400 !mb-1">
                                            {descriptionParts.userLabel}
                                          </p>

                                          <p className="!text-[12px] !font-medium !text-gray-700 !leading-snug !line-clamp-2">
                                            {descriptionParts.userReport}
                                          </p>
                                        </div>
                                      )}

                                      {descriptionParts.aiVision && (
                                        <div className="!rounded-lg !border !border-blue-100 !bg-blue-50 !px-2.5 !py-2">
                                          <div className="!flex !items-center !gap-1.5 !mb-1">
                                            <Bot
                                              size={12}
                                              className="!text-[#0a96f4] !flex-shrink-0"
                                            />

                                            <p className="!text-[9px] !font-extrabold !uppercase !tracking-[0.13em] !text-[#0a96f4]">
                                              {descriptionParts.aiLabel}
                                            </p>
                                          </div>

                                          <p className="!text-[11px] !text-gray-700 !leading-snug !line-clamp-2">
                                            {descriptionParts.aiVision}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()
                              ) : (
                                <p className="!text-[12px] !italic !text-gray-400">
                                  Нема опис.
                                </p>
                              )}
                            </div>

                            <p className="!text-sm !text-gray-500">
                              {displayCat}
                            </p>
                          </div>
                        </td>

                        <td className="!px-6 !py-5 whitespace-nowrap">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "mk-MK",
                              )
                            : "—"}
                        </td>

                        <td className="!px-6 !py-5">
                          {item.institutionName || "—"}
                        </td>

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

                        <td className="!px-6 !py-5">
                          <Link
                            to={`/case/${item.id}`}
                            className="!inline-flex !items-center !justify-center !bg-blue-500 hover:!bg-blue-600 !text-white !px-4 !py-2 !rounded-xl !font-semibold !text-sm !no-underline !transition"
                          >
                            Детали
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="sm:!hidden !bg-gray-50 !p-4 !space-y-4">
            {loading ? (
              <div className="!bg-white !rounded-2xl !p-6 !text-center !text-gray-500">
                Се вчитуваат пријавите...
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="!bg-white !rounded-2xl !p-6 !text-center !text-gray-500">
                Нема пронајдени случаи.
              </div>
            ) : (
              filteredCases.map((item) => {
                const displayCat =
                  categoryMap[item.category]?.label || item.category;

                let displayStatus =
                  statusMap[item.status]?.label || item.status;

                if (item.status === "OPEN" || item.status === "ASSIGNED") {
                  displayStatus = "Нов";
                }

                const descriptionParts = formatDescriptionParts(
                  item.description,
                );

                return (
                  <div
                    key={item.id}
                    className="!bg-white !rounded-2xl !border !border-gray-100 !shadow-sm !p-4"
                  >
                    <div className="!flex !items-start !justify-between !gap-3 !mb-3">
                      <Link
                        to={`/case/${item.id}`}
                        className="!text-blue-600 !font-bold !text-sm hover:!underline !no-underline"
                      >
                        #{item.id}
                      </Link>

                      <span
                        className={`!px-3 !py-1 !rounded-full !text-[11px] !font-bold !whitespace-nowrap ${
                          item.status === "RESOLVED"
                            ? "!bg-green-100 !text-green-600"
                            : item.status === "IN_PROGRESS"
                              ? "!bg-blue-100 !text-blue-600"
                              : "!bg-orange-100 !text-orange-600"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>

                    <div className="!bg-gray-50 !rounded-xl !px-3 !py-2 !space-y-2">
                      {item.description ? (
                        <>
                          {descriptionParts.userReport && (
                            <div>
                              <p className="!text-[8px] !font-extrabold !uppercase !tracking-[0.12em] !text-gray-400 !mb-1">
                                {descriptionParts.userLabel}
                              </p>

                              <p className="!text-[11px] !font-medium !text-gray-700 !leading-snug !line-clamp-2">
                                {descriptionParts.userReport}
                              </p>
                            </div>
                          )}

                          {descriptionParts.aiVision && (
                            <div className="!rounded-lg !border !border-blue-100 !bg-blue-50 !px-2 !py-1.5">
                              <div className="!flex !items-center !gap-1 !mb-1">
                                <Bot
                                  size={11}
                                  className="!text-[#0a96f4] !shrink-0"
                                />

                                <p className="!text-[8px] !font-extrabold !uppercase !tracking-[0.12em] !text-[#0a96f4]">
                                  {descriptionParts.aiLabel}
                                </p>
                              </div>

                              <p className="!text-[10px] !text-gray-700 !leading-snug !line-clamp-2">
                                {descriptionParts.aiVision}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="!text-[11px] !italic !text-gray-400">
                          Нема опис.
                        </p>
                      )}
                    </div>

                    <div className="!mt-3 !flex !items-center !gap-1.5 !flex-wrap">
                      <span className="!inline-flex !px-2.5 !py-1 !rounded-lg !bg-blue-50 !text-blue-600 !text-[11px] !font-bold !border !border-blue-100">
                        {displayCat}
                      </span>
                    </div>

                    <div className="!mt-4 !grid !grid-cols-1 !gap-3 !text-[12px]">
                      <div className="!bg-gray-50 !rounded-xl !px-3 !py-2">
                        <p className="!text-[10px] !font-bold !uppercase !tracking-[0.14em] !text-gray-400 !mb-0.5">
                          Датум
                        </p>
                        <p className="!font-semibold !text-gray-700">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "mk-MK",
                              )
                            : "—"}
                        </p>
                      </div>

                      <div className="!bg-gray-50 !rounded-xl !px-3 !py-2">
                        <p className="!text-[10px] !font-bold !uppercase !tracking-[0.14em] !text-gray-400 !mb-0.5">
                          Надлежна институција
                        </p>
                        <p className="!font-semibold !text-gray-700 !break-words">
                          {item.institutionName || "—"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/case/${item.id}`}
                      className="!mt-4 !w-full !inline-flex !items-center !justify-center !bg-blue-500 hover:!bg-blue-600 !text-white !px-4 !py-2.5 !rounded-xl !font-semibold !text-sm !no-underline !transition"
                    >
                      Детали
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          <div className="!px-6 max-sm:!px-4 !py-5 !border-t !flex !justify-between !text-gray-500 max-sm:!text-sm">
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