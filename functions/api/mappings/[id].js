export async function onRequestGet({ params, env }) {
  try {
    const mapping = await env.DB.prepare(
      'SELECT * FROM mappings WHERE id = ?'
    ).bind(params.id).first()
    if (!mapping) return Response.json({ ok: false, error: 'Introuvable' }, { status: 404 })
    mapping.rules = JSON.parse(mapping.rules)
    return Response.json({ ok: true, mapping })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function onRequestPut({ params, request, env }) {
  try {
    const body = await request.json()
    const { name, description, source_file, target_file, rules } = body
    await env.DB.prepare(
      'UPDATE mappings SET name=?, description=?, source_file=?, target_file=?, rules=?, updated_at=datetime("now") WHERE id=?'
    ).bind(name, description || '', source_file, target_file, JSON.stringify(rules), params.id).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function onRequestDelete({ params, env }) {
  try {
    await env.DB.prepare('DELETE FROM mappings WHERE id = ?').bind(params.id).run()
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
