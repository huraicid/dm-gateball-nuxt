import { createSessionToken, SESSION_COOKIE } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body ?? {}

  const env = event.context.cloudflare?.env ?? process.env
  const adminUsername = env.ADMIN_USERNAME
  const adminPassword = env.ADMIN_PASSWORD
  const sessionSecret = env.SESSION_SECRET

  if (!adminUsername || !adminPassword || !sessionSecret) {
    throw createError({ statusCode: 500, message: 'サーバー設定エラー' })
  }

  if (username !== adminUsername || password !== adminPassword) {
    throw createError({ statusCode: 401, message: 'IDまたはパスワードが違います' })
  }

  const token = await createSessionToken(sessionSecret)
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return { ok: true }
})
