import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

import {
  Search,
  Droplets,
  Construction,
  Leaf,
  Maximize2,
  Navigation,
  Plus,
  Minus,
  Layers,
  Calendar,
  Tag,
  Loader2,
  Flame,
  Zap,
  Bot,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { getReports, categoryMap, statusMap } from "../api/apiService";
import { formatDescriptionParts } from "../utils/formatDescription";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom colored markers
function createColoredIcon(color, isResolved = false) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>

      <path
        d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z"
        fill="${color}"
        filter="url(#shadow)"
        opacity="${isResolved ? "0.7" : "1"}"
      />

      <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>

      ${
        isResolved
          ? `<path d="M12 16l3 3 5-5" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/>`
          : `<circle cx="16" cy="16" r="3" fill="${color}"/>`
      }
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

// Map Controls
function MapControls() {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.setView([42.0, 21.43], map.getZoom())}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              map.setView([pos.coords.latitude, pos.coords.longitude], 15);
            });
          }
        }}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
      >
        <Navigation className="w-4 h-4" />
      </button>

      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}

// Automatically move map to selected pin
function FlyToLocation({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([Number(lat), Number(lng)], 17, {
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);

  return null;
}

const filterCategories = [
  { id: "all", label: "Сите", icon: null },

  {
    id: "WATER",
    label: "Водовод",
    icon: Droplets,
  },

  {
    id: "ELECTRICITY",
    label: "Електрика",
    icon: Zap,
  },

  {
    id: "ROAD",
    label: "Патишта",
    icon: Construction,
  },

  {
    id: "WASTE",
    label: "Отпад",
    icon: Leaf,
  },

  {
    id: "FIRE",
    label: "Пожар",
    icon: Flame,
  },
];

const legendItems = [
  {
    color: "#0a96f4",
    label: "Водовод и канализација",
  },

  {
    color: "#eab308",
    label: "Електрична енергија",
  },

  {
    color: "#8b5cf6",
    label: "Патна инфраструктура",
  },

  {
    color: "#22c55e",
    label: "Решени случаи",
  },

  {
    color: "#ef4444",
    label: "Пожар / Итни",
  },
];

export default function ProblemsMap() {
  const [searchParams] = useSearchParams();

  const targetLat = searchParams.get("lat");
  const targetLng = searchParams.get("lng");

  const mapCenter =
    targetLat && targetLng
      ? [Number(targetLat), Number(targetLng)]
      : [42.0, 21.434];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const data = await getReports();

        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProblems = reports.filter((p) => {
    if (!p.latitude || !p.longitude) return false;

    const matchesSearch =
      !searchQuery ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === "all" || p.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getMarkerColor = (report) => {
    if (report.status === "RESOLVED") {
      return "#22c55e";
    }

    return categoryMap[report.category]?.color || "#6b7280";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MainNavbar />

      {/* Search */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Пребарај..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#f5f7fb] border border-gray-200 rounded-full text-sm"
            />
          </div>

          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max pb-1 sm:pb-0">
              {filterCategories.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                      isActive
                        ? "bg-[#0a96f4] text-white"
                        : "bg-white border border-gray-200 text-gray-600"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="relative flex-1 w-full">
        {loading && (
          <div className="absolute inset-0 z-[1001] bg-white/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={14}
          zoomControl={false}
          className="h-full w-full"
        >
          <FlyToLocation lat={targetLat} lng={targetLng} />

          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapControls />

          {filteredProblems.map((report) => {
            const descParts = formatDescriptionParts(report.description);

            return (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createColoredIcon(
                  getMarkerColor(report),
                  report.status === "RESOLVED",
                )}
              >
                <Popup className="custom-popup">
                  <div className="p-4 min-w-[220px] max-w-[280px]">
                    {report.description ? (
                      <div className="mb-3 space-y-2">
                        {descParts.userReport && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 m-0">
                              {descParts.userLabel}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 leading-snug m-0">
                              {descParts.userReport}
                            </p>
                          </div>
                        )}

                        {descParts.aiVision && (
                          <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 mt-2">
                            <div className="flex items-center gap-1 mb-1">
                              <Bot size={12} className="text-[#0a96f4]" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0a96f4] m-0">
                                {descParts.aiLabel}
                              </p>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed m-0">
                              {descParts.aiVision}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-2 m-0">
                        Нема опис.
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Tag className="w-3 h-3 shrink-0" />
                      {categoryMap[report.category]?.label || report.category}
                    </div>

                    {report.institutionName && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {report.institutionName}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#e8f4fe] text-[#0a96f4]">
                        {statusMap[report.status]?.label || report.status}
                      </span>
                      <a
                        href={`/case/${report.id}`}
                        className="text-xs font-semibold text-[#0a96f4] hover:underline"
                      >
                        Детали →
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-[1000] bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-5 min-w-[160px] sm:min-w-[200px] scale-90 sm:scale-100 origin-bottom-left">
          {" "}
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-500" />

            <h3 className="text-sm font-bold">Легенда</h3>
          </div>
          <div className="space-y-2">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
