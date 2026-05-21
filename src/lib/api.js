const BASE = '/api/mappings'

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
