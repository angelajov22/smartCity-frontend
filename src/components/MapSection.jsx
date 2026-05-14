import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPin, Maximize2 } from "lucide-react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const redIcon = new L.DivIcon({
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #ef4444;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(239,68,68,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8 2 5 5 5 9c0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);

  return null;
}

export default function MapSection() {
  const [userPosition, setUserPosition] = useState(null);

  const [locationStatus, setLocationStatus] = useState(
    navigator.geolocation ? "loading" : "denied",
  );

  const [address, setAddress] = useState("");
  const [reports, setReports] = useState([]);

  const navigate = useNavigate();

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
        return status;
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
        return category;
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(
          "https://smartcity-0e3f.onrender.com/api/reports",
        );

        if (!res.ok) {
          throw new Error("Reports request failed");
        }

        const data = await res.json();

        console.log("REPORTS:", data);

        const reportsWithLocation = data.filter(
          (report) =>
            report.latitude !== null &&
            report.longitude !== null &&
            report.latitude !== undefined &&
            report.longitude !== undefined,
        );

        setReports(reportsWithLocation);
      } catch (error) {
        console.log("Reports fetch error:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setUserPosition([lat, lon]);
        setLocationStatus("granted");

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
              headers: {
                Accept: "application/json",
              },
            },
          );

          if (!res.ok) {
            throw new Error("Address request failed");
          }

          const data = await res.json();

          setAddress(
            data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
          );
        } catch (err) {
          console.log("Address fetch error:", err);
          setAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        }
      },
      (error) => {
        console.log("Location error:", error);
        setLocationStatus("denied");
      },
    );
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden w-full max-w-[620px]">
      <div className="h-[420px] w-full">
        <MapContainer
          center={userPosition || [41.9981, 21.4254]}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
        >
          {userPosition && <ChangeMapView center={userPosition} />}

          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {userPosition && (
            <Marker position={userPosition}>
              <Popup>Твојата локација</Popup>
            </Marker>
          )}

          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={redIcon}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
              }}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="min-w-[220px]">
                  <p className="font-semibold text-sm m-0">
                    Пријава #{report.id}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-gray-500">
                        Статус:
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(report.status)}`}
                      >
                        {getStatusLabel(report.status)}
                      </span>
                    </div>

                    {report.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-500">
                          Категорија:
                        </span>

                        <span className="text-[12px] font-medium text-gray-700">
                          {getCategoryLabel(report.category)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/map?lat=${report.latitude}&lng=${report.longitude}&reportId=${report.id}`,
                        )
                      }
                      className="rounded-lg bg-[#0a96f4] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-600 transition"
                    >
                      Погледни на мапа
                    </button>

                    <button
                      onClick={() => navigate(`/case/${report.id}`)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      Детали
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>

          <div className="flex flex-col gap-0">
            <p className="!text-xs !font-semibold !m-0">Тековна локација</p>

            <p className="!text-xs !text-gray-500 !m-0">
              {locationStatus === "loading" && "Се вчитува..."}

              {locationStatus === "denied" && "Нема дозволена локација"}

              {locationStatus === "granted" &&
                (address
                  ? address.split(",").slice(0, 2).join(", ")
                  : "Се вчитува адреса...")}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/map")}
          className="hover:bg-gray-100 flex items-center gap-1 border px-3 py-1 rounded text-xs transition"
        >
          <Maximize2 className="w-3 h-3" />
          Види мапа
        </button>
      </div>
    </div>
  );
}
