import { useState } from 'react'
import {
  Search,
  Filter,
  Droplets,
  Lightbulb,
  Construction,
  Leaf,
  Maximize2,
  Navigation,
  Plus,
  Minus,
  Layers,
  Calendar,
  Tag,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapProblems } from '../data/mockData'

// Fix default marker icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Create custom colored marker
function createColoredIcon(color, isResolved = false) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" 
            fill="${color}" filter="url(#shadow)" opacity="${isResolved ? '0.7' : '1'}"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>
      ${isResolved ? '<path d="M12 16l3 3 5-5" stroke="' + color + '" stroke-width="2" fill="none" stroke-linecap="round"/>' : 
        '<circle cx="16" cy="16" r="3" fill="' + color + '"/>'}
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  })
}

const filterCategories = [
  { id: 'all', label: 'Сите', icon: null, active: true },
  { id: 'water', label: 'Водовод', icon: Droplets, color: '#0a96f4', categoryMatch: 'Водовод и канализација' },
  { id: 'lighting', label: 'Осветлување', icon: Lightbulb, color: '#f59e0b', categoryMatch: 'Јавно осветлување' },
  { id: 'roads', label: 'Патишта', icon: Construction, color: '#8b5cf6', categoryMatch: 'Патна инфраструктура' },
  { id: 'ecology', label: 'Екологија', icon: Leaf, color: '#22c55e', categoryMatch: 'Екологија' },
]

const legendItems = [
  { color: '#0a96f4', label: 'Водовод и канализација' },
  { color: '#f59e0b', label: 'Јавно осветлување' },
  { color: '#8b5cf6', label: 'Патна инфраструктура' },
  { color: '#22c55e', label: 'Решени случаи' },
]

function MapControls() {
  const map = useMap()
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.setView([42.0, 21.43], map.getZoom())}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0a96f4] hover:bg-[#e8f4fe] transition-all"
        title="Прошири"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              map.setView([pos.coords.latitude, pos.coords.longitude], 15)
            })
          }
        }}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0a96f4] hover:bg-[#e8f4fe] transition-all"
        title="Моја локација"
      >
        <Navigation className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
        title="Зумирај"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
        title="Одзумирај"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ProblemsMap() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)

  const filteredProblems = mapProblems.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === 'all' ||
      filterCategories.find((f) => f.id === activeFilter)?.categoryMatch === p.category

    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col flex-1">
      {/* Search & Filters Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-[480px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пребарај по наслов или населба..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fb] border border-gray-200 rounded-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a96f4]/20 focus:border-[#0a96f4] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2">
            {filterCategories.map((filter) => {
              const Icon = filter.icon
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? filter.id === 'all'
                        ? 'bg-[#0a96f4] text-white shadow-md shadow-blue-200'
                        : 'bg-gray-800 text-white shadow-md'
                      : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {filter.label}
                </button>
              )
            })}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <Filter className="w-4 h-4" />
              Останати Филтри
            </button>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative" style={{ height: 'calc(100vh - 64px - 52px - 57px)' }}>
        <MapContainer
          center={[42.0, 21.4340]}
          zoom={14}
          zoomControl={false}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapControls />

          {filteredProblems.map((problem) => (
            <Marker
              key={problem.id}
              position={[problem.lat, problem.lng]}
              icon={createColoredIcon(problem.color, problem.status === 'resolved')}
              eventHandlers={{
                click: () => setSelectedProblem(problem),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-[220px]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">{problem.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        problem.status === 'resolved'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-[#e8f4fe] text-[#0a96f4]'
                      }`}
                    >
                      {problem.status === 'resolved' ? 'Решен' : 'Активен'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{problem.description}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Tag className="w-3 h-3" />
                      {problem.category}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {problem.date}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-5 min-w-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-800">Легенда</h3>
          </div>
          <div className="space-y-2.5">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
