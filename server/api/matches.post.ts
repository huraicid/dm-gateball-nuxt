import { verifySessionToken, SESSION_COOKIE } from '../utils/session'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  const env = event.context.cloudflare?.env ?? process.env
  const sessionSecret = env.SESSION_SECRET

  if (!sessionSecret || !await verifySessionToken(token, sessionSecret)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { deck1_id, deck2_id, winner_id } = body ?? {}

  if (!deck1_id || !deck2_id || !winner_id) {
    throw createError({ statusCode: 400, message: 'deck1_id, deck2_id, winner_id are required' })
  }
  if (deck1_id === deck2_id) {
    throw createError({ statusCode: 400, message: 'deck1 and deck2 must be different' })
  }
  if (winner_id !== deck1_id && winner_id !== deck2_id) {
    throw createError({ statusCode: 400, message: 'winner must be deck1 or deck2' })
  }

  const db = event.context.cloudflare.env.DB
  await db.prepare('INSERT INTO matches (deck1_id, deck2_id, winner_id) VALUES (?, ?, ?)')
    .bind(deck1_id, deck2_id, winner_id)
    .run()

  return { ok: true }
})
