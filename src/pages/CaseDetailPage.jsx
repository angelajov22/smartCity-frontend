import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDescriptionParts } from "../utils/formatDescription";
import {
  ArrowLeft,
  Share2,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Send,
  Navigation,
  Bot,
} from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import MainFooter from "../components/MainFooter";

const API_URL = "https://smartcity-0e3f.onrender.com";

const getStatusLabel = (status) => {
  switch (status) {
    case "OPEN":
      return "Пријавено";
    case "ASSIGNED":
      return "Доделено";
    case "IN_PROGRESS":
      return "Во тек";
    case "RESOLVED":
      return "Решено";
    default:
      return status || "—";
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-[#0a96f4] border border-blue-200";
    case "ASSIGNED":
      return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "RESOLVED":
      return "bg-green-100 text-green-700 border border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const getCategoryLabel = (category) => {
  switch (category) {
    case "WATER":
      return "Водовод и канализација";
    case "FIRE":
      return "Пожар";
    case "ROAD":
      return "Оштетен пат / дупки";
    case "TRAFFIC":
      return "Сообраќај";
    case "WASTE":
      return "Отпад и хигиена";
    case "ELECTRICITY":
      return "Електрика / Осветлување";
    case "PUBLIC_SAFETY":
      return "Јавна безбедност";
    case "OTHER":
      return "Останато";
    default:
      return category || "—";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return (
    new Date(date).toLocaleDateString("mk-MK", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    " • " +
    new Date(date).toLocaleTimeString("mk-MK", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setImageError(false);

      try {
        const response = await fetch(`${API_URL}/api/reports/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        setCaseData(data);
      } catch (error) {
        console.error("Error loading report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f9ff]">
        <MainNavbar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Се вчитува случајот...</p>
        </main>

        <MainFooter />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f9ff]">
        <MainNavbar />

        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-500">Не може да се вчита случајот.</p>
        </main>

        <MainFooter />
      </div>
    );
  }

  const descriptionParts = formatDescriptionParts(caseData.description);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f9ff]">
      <MainNavbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-[#0a96f4] transition mt-1"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Детали за случај #{caseData.id}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                  <span className="text-gray-500">Категорија:</span>
                  {getCategoryLabel(caseData.category)}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                    caseData.status,
                  )}`}
                >
                  <span>Статус:</span>
                  {getStatusLabel(caseData.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm hover:border-[#0a96f4] hover:text-[#0a96f4] transition shadow-sm">
              <Share2 size={15} />
              Сподели
            </button>

            <button
              onClick={() => setShowCommentBox((v) => !v)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0a96f4] text-white text-sm font-semibold hover:bg-[#0082e0] transition shadow-sm"
            >
              <MessageSquare size={15} />
              Коментирај
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-md bg-gray-100 aspect-video flex items-center justify-center">
              {caseData.imageUrl && !imageError ? (
                <img
                  src={caseData.imageUrl}
                  alt="Слика од пријавата"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 shadow-sm">
                    <Navigation className="w-7 h-7 text-[#0a96f4]" />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Нема достапна слика
                  </h3>

                  <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
                    Моментално нема прикачена слика за оваа пријава.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 sm:p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">
                Опис на пријавата
              </h2>

              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 min-h-[60px]">
                {caseData.description ? (
                  <div className="space-y-4">
                    {descriptionParts.userReport && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                          {descriptionParts.userLabel}
                        </p>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {descriptionParts.userReport}
                        </p>
                      </div>
                    )}

                    {descriptionParts.aiVision && (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <div className="flex items-center gap-2">
                          <Bot size={16} className="text-[#0a96f4]" />

                          <p className="text-xs mt-3 font-bold uppercase tracking-widest text-[#0a96f4]">
                            {descriptionParts.aiLabel}
                          </p>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {descriptionParts.aiVision}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Нема опис.</p>
                )}
              </div>
            </div>

            {showCommentBox && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-4 sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4">
                  <MessageSquare size={17} className="text-[#0a96f4]" />
                  Нов коментар
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    ?
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Напиши коментар..."
                      rows={3}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a96f4] focus:ring-2 focus:ring-blue-100 transition resize-none"
                    />

                    <button className="self-end px-3 py-2.5 bg-[#0a96f4] hover:bg-[#0082e0] text-white rounded-xl transition">
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 sm:p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                Информации за пријавата
              </h3>

              <p className="text-xs text-gray-400 mb-5">
                Брз преглед на основните податоци
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex gap-3 items-start pb-4 border-b border-gray-100">
                  <MapPin
                    size={15}
                    className="text-[#0a96f4] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                      Институција
                    </p>

                    <p className="text-sm text-gray-700">
                      {caseData.institutionName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start pb-4 border-b border-gray-100">
                  <Calendar
                    size={15}
                    className="text-[#0a96f4] mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                      Датум на пријавување
                    </p>

                    <p className="text-sm text-gray-700">
                      {formatDate(caseData.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start pb-4 border-b border-gray-100">
                  <Clock size={15} className="text-[#0a96f4] mt-0.5 shrink-0" />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                      Последна промена
                    </p>

                    <p className="text-sm text-gray-700">
                      {formatDate(caseData.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Navigation
                    size={15}
                    className="text-[#0a96f4] mt-0.5 shrink-0"
                  />

                  <div className="w-full min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Геолокација
                    </p>

                    {caseData.latitude && caseData.longitude ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/map?reportId=${caseData.id}&lat=${caseData.latitude}&lng=${caseData.longitude}`,
                            )
                          }
                          className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-blue-100 group"
                        >
                          <iframe
                            title="Локација на пријавата"
                            src={`https://www.google.com/maps?q=${caseData.latitude},${caseData.longitude}&z=16&output=embed`}
                            className="w-full h-full pointer-events-none"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                            <MapPin
                              size={30}
                              className="text-red-500 drop-shadow-md fill-red-500"
                            />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/map?reportId=${caseData.id}&lat=${caseData.latitude}&lng=${caseData.longitude}`,
                            )
                          }
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#0a96f4] hover:underline font-medium"
                        >
                          Отвори ја пријавата на мапа <ExternalLink size={11} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-28 rounded-xl bg-gray-100 flex items-center justify-center">
                        <p className="text-xs text-gray-400 italic text-center px-3">
                          Нема достапна локација
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
};

export default CaseDetailPage;
