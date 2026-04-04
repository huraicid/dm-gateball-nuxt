export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB

  const { results } = await db.prepare(`
    SELECT
      m.id,
      m.played_at,
      d1.name AS deck1_name,
      d2.name AS deck2_name,
      dw.name AS winner_name
    FROM matches m
    JOIN decks d1 ON m.deck1_id = d1.id
    JOIN decks d2 ON m.deck2_id = d2.id
    JOIN decks dw ON m.winner_id = dw.id
    ORDER BY m.played_at DESC, m.id DESC
    LIMIT 5
  `).all<{
    id: number
    played_at: string
    deck1_name: string
    deck2_name: string
    winner_name: string
  }>()

  return results
})
