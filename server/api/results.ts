export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB

  const { results: decks } = await db.prepare('SELECT id, name FROM decks ORDER BY id').all<{ id: string, name: string }>()

  const { results: rows } = await db.prepare(`
    SELECT
      d1.id AS deck_id,
      d2.id AS opponent_id,
      SUM(CASE WHEN m.winner_id = d1.id THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN m.winner_id = d2.id THEN 1 ELSE 0 END) AS losses
    FROM decks d1
    CROSS JOIN decks d2
    LEFT JOIN matches m
      ON (m.deck1_id = d1.id AND m.deck2_id = d2.id)
      OR (m.deck1_id = d2.id AND m.deck2_id = d1.id)
    WHERE d1.id != d2.id
    GROUP BY d1.id, d2.id
  `).all<{ deck_id: string, opponent_id: string, wins: number, losses: number }>()

  // マトリクス形式に変換
  const deckIds = decks.map(d => d.id)
  const indexMap = new Map(deckIds.map((id, i) => [id, i]))

  const results: ({ wins: number, losses: number } | null)[][] = deckIds.map(() =>
    deckIds.map(() => null)
  )

  for (const row of rows) {
    const i = indexMap.get(row.deck_id)!
    const j = indexMap.get(row.opponent_id)!
    results[i][j] = { wins: row.wins, losses: row.losses }
  }

  return {
    decks: decks.map(d => ({ id: d.id, name: d.name })),
    results,
  }
})
