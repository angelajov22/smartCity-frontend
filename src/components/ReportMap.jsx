import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet"

import { useEffect, useState } from "react"
import L from "leaflet"

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition(event.latlng)
    },
  })

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup>Избрана локација</Popup>
    </Marker>
  )
}

function ReportMap() {
  const [position, setPosition] = useState({
    lat: 41.9981,
    lng: 21.4254,
  })

  const [address, setAddress] = useState("Се вчитува адреса...")

  useEffect(() => {
    async function getAddress() {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
        )

        const data = await response.json()

        setAddress(data.display_name)
      } catch (error) {
        setAddress("Не може да се вчита адреса")
      }
    }

    getAddress()
  }, [position])

  return (
    <section className="!sticky !top-0 !h-[720px] !relative !overflow-hidden">
      <MapContainer
        center={[41.9981, 21.4254]}
        zoom={13}
        className="!w-full !h-full !z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
        />
      </MapContainer>

      <div className="!absolute !top-8 !left-8 !right-8 !z-[1000] !bg-white !rounded-2xl !px-6 !py-4 !shadow !flex !items-center !gap-3 !text-gray-500">
        🔍
        <span>Кликни на мапата за да означиш локација...</span>
      </div>

      <div className="!absolute !bottom-8 !left-8 !z-[1000] !bg-white !rounded-2xl !shadow !px-6 !py-5 !w-96">
        <p className="!text-sm !font-bold !text-gray-500">
          ИЗБРАНА ЛОКАЦИЈА
        </p>

        <p className="!font-bold !text-gray-900 !mt-2 !break-words">
          {address}
        </p>

        <p className="!text-xs !text-gray-400 !mt-3">
          Lat: {position.lat.toFixed(5)} | Lng:{" "}
          {position.lng.toFixed(5)}
        </p>
      </div>
    </section>
  )
}

export default ReportMap