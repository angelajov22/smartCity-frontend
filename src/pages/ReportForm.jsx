import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReportNavbar from "../components/ReportNavbar";
import ReportCategorySelector from "../components/ReportCategorySelector";
import ReportDetails from "../components/ReportDetails";
import ReportUpload from "../components/ReportUpload";
import ReportMap from "../components/ReportMap";

function getInstitutionByCategory(category) {
  switch (category) {
    case "Јавно осветлување":
      return "ЕВН Македонија";

    case "Оштетен пат / Дупки":
      return "ЈП Улици и Патишта";

    case "Отпад и хигиена":
      return "Комунална хигиена";

    case "Водовод и канализација":
      return "ЈП Водовод и Канализација";

    case "Паркови и зеленило":
      return "Паркови и зеленило";

    default:
      return "Општина Центар";
  }
}

function ReportForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  function handleSubmit() {
    if (!selectedCategory || !description.trim()) {
      alert("Ве молиме изберете категорија и внесете опис.");
      return;
    }

    const savedCases = JSON.parse(localStorage.getItem("cases")) || [];

    const nextIdNumber = String(savedCases.length + 1).padStart(3, "0");
    const currentYear = new Date().getFullYear();

    const newCase = {
      id: `${currentYear}-${nextIdNumber}`,

      title:
        description.length > 55
          ? description.slice(0, 55) + "..."
          : description,

      category: selectedCategory,

      date: new Date().toISOString().split("T")[0],

      municipality: "Центар",

      institution: getInstitutionByCategory(selectedCategory),

      status: "Пријавено",

      imageName: selectedFile ? selectedFile.name : "",
    };

    const updatedCases = [...savedCases, newCase];

    localStorage.setItem("cases", JSON.stringify(updatedCases));

    alert("Пријавата е успешно испратена.");

    setSelectedCategory("");
    setDescription("");
    setSelectedFile(null);

    navigate("/problems");
  }

  return (
    <div className="min-h-screen bg-white">
      <ReportNavbar />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]">
        <section className="px-12 py-12 max-w-3xl mx-auto w-full">
          <h1 className="!text-4xl !font-bold !text-gray-900">
            Пријави нов проблем
          </h1>

          <p className="!text-gray-600 !mt-4 !text-lg !leading-relaxed">
            Вашата пријава директно помага за подобра и пофункционална
            заедница. Ве молиме пополнете ги задолжителните полиња.
          </p>

          <ReportCategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <ReportDetails
            description={description}
            setDescription={setDescription}
          />

          <ReportUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          <div className="!mt-12 !border !rounded-2xl !px-6 !py-5 !font-semibold !text-gray-700">
            ⓘ Со кликнување на „Испрати пријава“, потврдувате дека наведените
            податоци се точни и локацијата на мапата е правилно означена.
          </div>

          <button
            onClick={handleSubmit}
            className="!mt-8 !w-full !bg-orange-500 !text-white !font-bold !text-xl !py-5 !rounded-2xl shadow-lg hover:!bg-orange-600 !transition"
          >
            Испрати пријава
          </button>
        </section>

        <ReportMap />
      </main>
    </div>
  );
}

export default ReportForm;