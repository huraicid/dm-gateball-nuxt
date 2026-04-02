import { verifySessionToken, SESSION_COOKIE } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  const env = event.context.cloudflare?.env ?? process.env
  const sessionSecret = env.SESSION_SECRET

  if (!sessionSecret || !await verifySessionToken(token, sessionSecret)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  return { ok: true }
})
