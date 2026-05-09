import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { initialCases } from "../data/initialCases";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";

function CasesList() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("Сите општини");
  const [categoryFilter, setCategoryFilter] = useState("Сите категории");
  const [statusFilter, setStatusFilter] = useState("Сите статуси");

  useEffect(() => {
    const savedCases = localStorage.getItem("cases");

    if (savedCases) {
      setCases(JSON.parse(savedCases));
    } else {
      setCases(initialCases);
      localStorage.setItem("cases", JSON.stringify(initialCases));
    }
  }, []);

  const filteredCases = cases.filter((item) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(search) ||
      item.institution.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.municipality.toLowerCase().includes(search);

    const matchesMunicipality =
      municipalityFilter === "Сите општини" ||
      item.municipality === municipalityFilter;

    const matchesCategory =
      categoryFilter === "Сите категории" || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "Сите статуси" || item.status === statusFilter;

    return matchesSearch && matchesMunicipality && matchesCategory && matchesStatus;
  });

  const totalCases = cases.length;
  const activeCases = cases.filter((item) => item.status === "Во тек").length;
  const solvedCases = cases.filter((item) => item.status === "Решено").length;

  function clearFilters() {
    setSearchTerm("");
    setMunicipalityFilter("Сите општини");
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

        <section className="!bg-white !rounded-2xl !p-5 !mb-8 !flex !gap-4 !items-center">
          <span className="!font-semibold">Филтрирај според:</span>

          <select
            value={municipalityFilter}
            onChange={(event) => setMunicipalityFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2"
          >
            <option>Сите општини</option>
            <option>Центар</option>
            <option>Карпош</option>
            <option>Аеродром</option>
            <option>Кисела Вода</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2"
          >
            <option>Сите категории</option>
            <option>Оштетен пат / Дупки</option>
            <option>Отпад и хигиена</option>
            <option>Јавно осветлување</option>
            <option>Водовод и канализација</option>
            <option>Паркови и зеленило</option>
            <option>Останато</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="!border !rounded-xl !px-4 !py-2"
          >
            <option>Сите статуси</option>
            <option>Пријавено</option>
            <option>Во тек</option>
            <option>Решено</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="!text-gray-500 !font-semibold !bg-transparent !border-0"
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
                <th className="!px-6 !py-4">Наслов на пријава</th>
                <th className="!px-6 !py-4">Датум</th>
                <th className="!px-6 !py-4">Општина</th>
                <th className="!px-6 !py-4">Надлежна институција</th>
                <th className="!px-6 !py-4">Статус</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((item) => (
                <tr key={item.id} className="!border-t hover:!bg-gray-50">
                  <td className="!px-6 !py-5 !font-semibold !text-gray-600">#{item.id}</td>
                  <td className="!px-6 !py-5">
                    <p className="!font-bold">{item.title}</p>
                    <p className="!text-sm !text-gray-500">{item.category}</p>
                  </td>
                  <td className="!px-6 !py-5">{item.date}</td>
                  <td className="!px-6 !py-5">{item.municipality}</td>
                  <td className="!px-6 !py-5">{item.institution}</td>
                  <td className="!px-6 !py-5">
                    <span
                      className={`!px-3 !py-1 !rounded-full !text-sm !font-bold ${
                        item.status === "Решено"
                          ? "!bg-green-100 !text-green-600"
                          : item.status === "Во тек"
                          ? "!bg-yellow-100 !text-yellow-700"
                          : "!bg-blue-100 !text-blue-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan="6" className="!text-center !py-10 !text-gray-500">
                    Нема пронајдени случаи.
                  </td>
                </tr>
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