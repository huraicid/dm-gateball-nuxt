export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB
  const { results } = await db.prepare('SELECT id, name FROM decks ORDER BY id').all<{ id: string, name: string }>()
  return results
})
