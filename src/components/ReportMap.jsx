import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition(event.latlng);
    },
  });

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup>Избрана локација</Popup>
    </Marker>
  );
}

function ReportMap({ position, setPosition }) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function getAddress() {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
        );

        const data = await response.json();
        setAddress(
          data.address?.road
            ? `${data.address.road}, ${data.address.city || "Скопје"}`
            : data.display_name || "Непозната локација"
        );
      } catch (error) {
        setAddress("Адресата не може да се вчита");
      }
    }

    getAddress();
  }, [position]);

  return (
    <section className="!relative lg:!sticky lg:!top-0 !h-[360px] sm:!h-[460px] lg:!h-[720px] !overflow-hidden">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        className="!w-full !h-full !z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>

      <div className="!absolute !top-4 !left-4 !right-4 lg:!top-8 lg:!left-8 lg:!right-8 !z-[1000] !bg-white/95 backdrop-blur-sm !rounded-2xl !px-4 sm:!px-6 !py-3 sm:!py-4 !shadow !flex !items-center !gap-3 !text-gray-500 !text-sm sm:!text-base">
        🔍
        <span>Кликни на мапата за да означиш локација...</span>
      </div>

      <div className="!absolute !bottom-4 !left-4 !right-4 lg:!bottom-8 lg:!left-8 lg:!right-auto !z-[1000] !bg-white !rounded-2xl !shadow !px-5 lg:!px-6 !py-4 lg:!py-5 lg:!w-96">
        <p className="!text-sm !font-bold !text-gray-500">
          ИЗБРАНА ЛОКАЦИЈА
        </p>

        <p className="!text-sm !font-semibold !text-gray-800 !mt-3 !leading-snug !line-clamp-2">
          {address || "Се вчитува адреса..."}
        </p>

        <p className="!text-xs !text-gray-400 !mt-3">
          Lat: {position.lat.toFixed(5)} | Lng: {position.lng.toFixed(5)}
        </p>
      </div>
    </section>
  );
}

export default ReportMap;