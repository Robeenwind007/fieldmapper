export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, description, source_file, target_file, created_at, updated_at FROM mappings ORDER BY updated_at DESC LIMIT 50'
    ).all()
    return Response.json({ ok: true, mappings: results })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { name, description, source_file, target_file, rules } = body
    if (!name || !source_file || !target_file || !rules) {
      return Response.json({ ok: false, error: 'Champs obligatoires manquants' }, { status: 400 })
    }
    const id = crypto.randomUUID()
    await env.DB.prepare(
      'INSERT INTO mappings (id, name, description, source_file, target_file, rules) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, name, description || '', source_file, target_file, JSON.stringify(rules)).run()
    return Response.json({ ok: true, id })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
