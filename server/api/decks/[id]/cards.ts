export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB
  const deckId = getRouterParam(event, 'id')

  const { results } = await db.prepare(
    'SELECT id, card_id, card_name, quantity FROM deck_cards WHERE deck_id = ? ORDER BY CAST(SUBSTR(card_id, 1, INSTR(card_id, \'/\') - 1) AS INTEGER)'
  ).bind(deckId).all<{ id: number, card_id: string, card_name: string, quantity: number }>()

  return results
})
