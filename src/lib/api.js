const BASE = '/api/mappings'
const LOCAL_KEY = 'fieldmapper_private_mappings'
const SECRET_CODE = '@8Erculepr0@$'

// ─── API D1 (mappings publics) ───────────────────────────────
export async function fetchMappings() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Erreur réseau')
  return res.json()
}

export async function fetchMapping(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Mapping introuvable')
  return res.json()
}

export async function saveMapping(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
  return res.json()
}

export async function updateMapping(id, payload) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erreur lors de la mise à jour')
  return res.json()
}

export async function deleteMapping(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erreur lors de la suppression')
  return res.json()
}

export function checkSecretCode(code) {
  return code === SECRET_CODE
}

// ─── localStorage (mappings privés) ─────────────────────────
export function getLocalMappings() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveLocalMapping(payload) {
  const mappings = getLocalMappings()
  const id = 'local_' + Date.now()
  const mapping = {
    ...payload,
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isLocal: true,
  }
  mappings.unshift(mapping)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(mappings))
  return mapping
}

export function deleteLocalMapping(id) {
  const mappings = getLocalMappings().filter(m => m.id !== id)
  localStorage.setItem(LOCAL_KEY, JSON.stringify(mappings))
}
