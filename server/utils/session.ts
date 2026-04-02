export const SESSION_COOKIE = 'dm_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 // 7日間（秒）

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_DURATION
  const data = `auth:${expiry}`
  const sig = await hmac(secret, data)
  return `${data}.${sig}`
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false
  const lastDot = token.lastIndexOf('.')
  if (lastDot === -1) return false
  const data = token.slice(0, lastDot)
  const sig = token.slice(lastDot + 1)
  const [, expiryStr] = data.split(':')
  const expiry = parseInt(expiryStr)
  if (isNaN(expiry) || expiry < Math.floor(Date.now() / 1000)) return false
  const expectedSig = await hmac(secret, data)
  return sig === expectedSig
}
