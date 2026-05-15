const API_BASE = 'https://smartcity-0e3f.onrender.com'
const ADMIN_AUTH = 'Basic ' + btoa('admin:admin123')

// ─── Category mapping: backend enum → Macedonian display label ───
export const categoryMap = {
  WATER: { label: 'Водовод и канализација', color: '#0a96f4', icon: 'droplets' },
  FIRE: { label: 'Пожар', color: '#ef4444', icon: 'flame' },
  ROAD: { label: 'Патна инфраструктура', color: '#8b5cf6', icon: 'construction' },
  TRAFFIC: { label: 'Сообраќај', color: '#f59e0b', icon: 'traffic-cone' },
  WASTE: { label: 'Отпад / Хигиена', color: '#22c55e', icon: 'trash' },
  ELECTRICITY: { label: 'Електрична енергија', color: '#eab308', icon: 'zap' },
  PUBLIC_SAFETY: { label: 'Јавна безбедност', color: '#f97316', icon: 'shield' },
  OTHER: { label: 'Останато', color: '#6b7280', icon: 'help-circle' },
}

// ─── Status mapping: backend enum → Macedonian display label ───
export const statusMap = {
  OPEN: { label: 'Нов', color: 'orange' },
  ASSIGNED: { label: 'Нов', color: 'orange' },
  IN_PROGRESS: { label: 'Во тек', color: 'blue' },
  RESOLVED: { label: 'Решен', color: 'green' },
}

// ─── Helpers ───
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const { headers: extraHeaders, ...restOptions } = options
  const res = await fetch(url, {
    ...restOptions,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  // Some DELETE endpoints return no body
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return null
}

// ─── REPORTS ──────────────────────────────────────────────────

/** Get all reports */
export async function getReports() {
  return apiFetch('/api/reports')
}

/** Get a single report by ID */
export async function getReportById(id) {
  return apiFetch(`/api/reports/${id}`)
}

/** Create a new report (with optional image) */
export async function createReport({ description, category, latitude, longitude, image }) {
  const params = new URLSearchParams()
  params.append('description', description)
  if (category) params.append('category', category)
  params.append('latitude', latitude)
  params.append('longitude', longitude)

  const url = `${API_BASE}/api/reports?${params.toString()}`

  const options = { method: 'POST' }

  if (image) {
    const formData = new FormData()
    formData.append('image', image)
    options.body = formData
    // Don't set Content-Type, let browser set multipart boundary
  }

  const res = await fetch(url, options)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

/** Update a report (admin) */
export async function updateReport(id, data) {
  return apiFetch(`/api/admin/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

/** Update report status (admin) */
export async function updateReportStatus(id, status) {
  return apiFetch(`/api/admin/reports/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    headers: { Authorization: ADMIN_AUTH },
  })
}

/** Delete a report (admin) */
export async function deleteReport(id) {
  return apiFetch(`/api/admin/reports/${id}`, {
    method: 'DELETE',
    headers: { Authorization: ADMIN_AUTH },
  })
}

/** Get all categories */
export async function getCategories() {
  return apiFetch('/api/reports/categories')
}

/** Generate AI description from image */
export async function generateAIDescription(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  const res = await fetch(`${API_BASE}/api/reports/ai-description`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    throw new Error(`AI description failed: ${res.status}`)
  }
  return res.text()
}

// ─── INSTITUTIONS ─────────────────────────────────────────────

/** Get all institutions */
export async function getInstitutions() {
  return apiFetch('/api/institutions')
}

/** Get institution by ID */
export async function getInstitutionById(id) {
  return apiFetch(`/api/institutions/${id}`)
}

/** Create institution (admin) */
export async function createInstitution(data) {
  return apiFetch('/api/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

/** Update institution (admin) */
export async function updateInstitution(id, data) {
  return apiFetch(`/api/institutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

/** Delete institution (admin) */
export async function deleteInstitution(id) {
  return apiFetch(`/api/institutions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: ADMIN_AUTH },
  })
}
