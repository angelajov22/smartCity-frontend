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
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8 2 5 5 5 9c0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const markers = [
  { pos: [41.9981, 21.4254], label: "Дупка на пат — Центар" },
  { pos: [42.0034, 21.4098], label: "Расипана улична светилка" },
  { pos: [41.9921, 21.4322], label: "Нелегално депонирање" },
  { pos: [42.1322, 21.7144], label: "Преполн контејнер — Куманово" },
];

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

  const navigate = useNavigate();

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

          {markers.map((m, i) => (
            <Marker key={i} position={m.pos} icon={redIcon}>
              <Popup>{m.label}</Popup>
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
