const API_BASE = 'https://smartcity-0e3f.onrender.com'
const ADMIN_AUTH = 'Basic ' + btoa('admin:admin123')

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

export const statusMap = {
  OPEN: { label: 'Нов', color: 'orange' },
  ASSIGNED: { label: 'Нов', color: 'orange' },
  IN_PROGRESS: { label: 'Во тек', color: 'blue' },
  RESOLVED: { label: 'Решен', color: 'green' },
}

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
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return null
}

export async function getReports() {
  return apiFetch('/api/reports')
}

export async function getReportById(id) {
  return apiFetch(`/api/reports/${id}`)
}

export async function createReport({ description, category, latitude, longitude, image }) {
  const formData = new FormData()
  formData.append('description', description)
  if (category) formData.append('category', category)
  formData.append('latitude', String(latitude))
  formData.append('longitude', String(longitude))
  if (image) formData.append('image', image)

  const res = await fetch(`${API_BASE}/api/reports`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export async function updateReport(id, data) {
  return apiFetch(`/api/admin/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

export async function updateReportStatus(id, status) {
  return apiFetch(`/api/admin/reports/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    headers: { Authorization: ADMIN_AUTH },
  })
}

export async function deleteReport(id) {
  return apiFetch(`/api/admin/reports/${id}`, {
    method: 'DELETE',
    headers: { Authorization: ADMIN_AUTH },
  })
}

export async function getCategories() {
  return apiFetch('/api/reports/categories')
}

export async function getUsers() {
  return apiFetch('/api/users')
}

const AI_API_BASE = 'https://tmilenkovski-smartcity-ai.hf.space'

export async function analyzeImageWithAI(imageDataUrl) {
  const res = await fetch(`${AI_API_BASE}/generate-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl: imageDataUrl }),
  })
  if (!res.ok) {
    throw new Error(`AI analysis failed: ${res.status}`)
  }
  return res.json()
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function getInstitutions() {
  return apiFetch('/api/institutions')
}

export async function getInstitutionById(id) {
  return apiFetch(`/api/institutions/${id}`)
}

export async function createInstitution(data) {
  return apiFetch('/api/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

export async function updateInstitution(id, data) {
  return apiFetch(`/api/institutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: ADMIN_AUTH },
  })
}

export async function deleteInstitution(id) {
  return apiFetch(`/api/institutions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: ADMIN_AUTH },
  })
}
