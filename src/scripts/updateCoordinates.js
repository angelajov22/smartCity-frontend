const API_BASE = 'https://smartcity-0e3f.onrender.com'
const AUTH = 'Basic ' + btoa('admin:admin123')

const skopjeLocations = [
  { id: 1, lat: 41.9973, lng: 21.4280, name: 'Плоштад Македонија' },
  { id: 2, lat: 42.0042, lng: 21.4088, name: 'Аеродром' },
  { id: 3, lat: 41.9911, lng: 21.4314, name: 'Стара Чаршија' },
  { id: 5, lat: 41.9888, lng: 21.4590, name: 'Гази Баба' },
  { id: 6, lat: 42.0010, lng: 21.3850, name: 'Карпош' },
]

async function updateAll() {
  for (const loc of skopjeLocations) {
    try {
      const getRes = await fetch(`${API_BASE}/api/reports/${loc.id}`)
      if (!getRes.ok) { console.log(`Report ${loc.id} not found`); continue }
      const report = await getRes.json()

      const res = await fetch(`${API_BASE}/api/admin/reports/${loc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': AUTH },
        body: JSON.stringify({
          description: report.description || 'Пријавен проблем #' + loc.id,
          category: report.category,
          status: report.status,
          latitude: loc.lat,
          longitude: loc.lng,
        }),
      })

      if (res.ok) {
        console.log(`✅ #${loc.id} → ${loc.name} (${loc.lat}, ${loc.lng})`)
      } else {
        const text = await res.text()
        console.log(`❌ #${loc.id}: ${res.status} — ${text.substring(0, 120)}`)
      }
    } catch (err) {
      console.log(`❌ #${loc.id}: ${err.message}`)
    }
  }
  console.log('\nDone!')
}

updateAll()
