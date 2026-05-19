import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainNavbar from "../components/MainNavbar";
import ReportCategorySelector from "../components/ReportCategorySelector";
import ReportDetails from "../components/ReportDetails";
import ReportUpload from "../components/ReportUpload";
import ReportMap from "../components/ReportMap";

import {
  getCategories,
  createReport,
  updateReport,
  deleteReport,
  categoryMap,
  fileToDataUrl,
  analyzeImage,
} from "../api/apiService";

const VALID_CATEGORIES = [
  "WATER", "FIRE", "ROAD", "TRAFFIC", "WASTE",
  "ELECTRICITY", "PUBLIC_SAFETY",
];

function ReportForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [position, setPosition] = useState({ lat: 41.9981, lng: 21.4254 });
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [useAI, setUseAI] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [categoryRejected, setCategoryRejected] = useState(false);
  const [draftReportId, setDraftReportId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        const iconMap = {
          WATER: "🚰",
          FIRE: "🔥",
          ROAD: "🛣️",
          TRAFFIC: "🚦",
          WASTE: "🗑️",
          ELECTRICITY: "⚡",
          PUBLIC_SAFETY: "🛡️",
          OTHER: "❓",
        };
        const mapped = data.map((key) => ({
          key,
          icon: iconMap[key] || "❓",
          name: categoryMap[key]?.label || key,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setImagePreview(null);
      resetAIState();
      return;
    }

    let cancelled = false;
    async function generatePreview() {
      try {
        const dataUrl = await fileToDataUrl(selectedFile);
        if (!cancelled) setImagePreview(dataUrl);
      } catch (err) {
        console.error("Preview generation error:", err);
      }
    }
    generatePreview();
    return () => { cancelled = true; };
  }, [selectedFile]);

  function resetAIState() {
    setUseAI(false);
    setAiAnalyzing(false);
    setAiResult(null);
    setAiError(null);
    setCategoryRejected(false);
    setDraftReportId(null);
  }

  async function handleAnalyze() {
    if (!selectedFile) return;

    setAiAnalyzing(true);
    setAiError(null);
    setAiResult(null);
    setCategoryRejected(false);

    try {
      const result = await analyzeImage(selectedFile);

      const aiCategory = result.category?.toUpperCase() || null;
      const aiDesc = result.description || "";

      const categoryLabel = categoryMap[aiCategory]?.label || aiCategory || "Непозната";

      const irrelevantKeywords = [
        "карактер", "лик", "марио", "игра", "цртан", "анимаци", "сликар", "пиксел", "филм", "глумец",
        "cartoon", "game", "animation", "character", "mario", "painter", "pixel", "movie", "actor"
      ];

      const isIrrelevant = irrelevantKeywords.some(kw =>
        aiDesc.toLowerCase().includes(kw)
      );

      if (!aiCategory || !VALID_CATEGORIES.includes(aiCategory) || isIrrelevant) {
        setCategoryRejected(true);
        setAiResult({
          aiDescription: isIrrelevant
            ? "Сликата не е препознаена како урбан проблем."
            : (aiDesc || "Не може да се анализира"),
          categoryLabel: isIrrelevant ? "Невалидна слика" : categoryLabel
        });
        return;
      }

      setAiResult({
        aiDescription: aiDesc,
        categoryLabel,
        category: aiCategory
      });

      setSelectedCategory(aiCategory);
      if (aiDesc) setDescription(aiDesc);

    } catch (err) {
      console.error(err);
      setAiError(err.message);
    } finally {
      setAiAnalyzing(false);
    }
  }

  async function handleSubmit() {
    if (categoryRejected) {
      alert("Сликата не одговара на позната категорија. Ве молиме сменете ја сликата.");
      return;
    }

    if (!selectedCategory || !description.trim()) {
      alert("Ве молиме изберете категорија и внесете опис.");
      return;
    }

    setSubmitting(true);

    try {
      if (draftReportId) {
        await updateReport(draftReportId, {
          description: description.trim(),
          category: selectedCategory,
          latitude: position.lat,
          longitude: position.lng,
        });
        navigate(`/case/${draftReportId}`);
      } else {
        const createdReport = await createReport({
          description: description.trim(),
          category: selectedCategory,
          latitude: position.lat,
          longitude: position.lng,
          image: selectedFile || undefined,
        });
        navigate(`/case/${createdReport.id}`);
      }

      setSelectedCategory("");
      setDescription("");
      setSelectedFile(null);
      setImagePreview(null);
      resetAIState();
    } catch (err) {
      alert("Грешка при испраќање: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const submitBlocked = categoryRejected || (useAI && !aiResult && !aiError);

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]">
        <section className="!px-5 sm:!px-8 lg:!px-12 !py-8 lg:!py-12 max-w-3xl mx-auto w-full">
          <h1 className="!text-3xl sm:!text-4xl !font-bold !text-gray-900">
            Пријави нов проблем
          </h1>

          <p className="!text-gray-600 !mt-4 !text-base sm:!text-lg !leading-relaxed">
            Вашата пријава директно помага за подобра и пофункционална
            заедница. Ве молиме пополнете ги задолжителните полиња.
          </p>

          <ReportCategorySelector
            categories={categories}
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
            imagePreview={imagePreview}
            useAI={useAI}
            setUseAI={setUseAI}
            aiAnalyzing={aiAnalyzing}
            aiResult={aiResult}
            aiError={aiError}
            categoryRejected={categoryRejected}
            onAnalyze={handleAnalyze}
          />

          <div className="!mt-12 !border !rounded-2xl !px-6 !py-5 !font-semibold !text-gray-700">
            ⓘ Со кликнување на „Испрати пријава", потврдувате дека наведените
            податоци се точни и локацијата на мапата е правилно означена.
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || submitBlocked}
            className="!mt-8 !w-full !bg-orange-500 !text-white !font-bold !text-xl !py-5 !rounded-2xl shadow-lg hover:!bg-orange-600 !transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "⏳ Се испраќа..."
              : categoryRejected
                ? "⛔ Невалидна слика"
                : "Испрати пријава"}
          </button>
        </section>

        <ReportMap position={position} setPosition={setPosition} />
      </main>
    </div>
  );
}

export default ReportForm;
