interface CfEnv {
  CF_ACCESS_TEAM?: string
  CF_ACCESS_AUD?: string
}

function base64urlDecode(str: string): string {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

export async function verifyCfAccessJwt(token: string, env: CfEnv): Promise<{ email: string }> {
  const team = env.CF_ACCESS_TEAM
  if (!team) {
    // ローカル開発時: 検証スキップ
    return { email: 'dev@local' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }
  const [headerB64, payloadB64, sigB64] = parts

  const header = JSON.parse(base64urlDecode(headerB64))
  const payload = JSON.parse(base64urlDecode(payloadB64))

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    throw new Error('JWT expired')
  }

  if (env.CF_ACCESS_AUD) {
    const aud: string[] = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!aud.includes(env.CF_ACCESS_AUD)) {
      throw new Error('Invalid JWT audience')
    }
  }

  const certsUrl = `https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`
  const certsRes = await fetch(certsUrl)
  if (!certsRes.ok) {
    throw new Error('Failed to fetch CF Access certs')
  }
  const jwks = await certsRes.json() as { keys: JsonWebKey[] }
  const jwk = header.kid
    ? jwks.keys.find((k: any) => k.kid === header.kid)
    : jwks.keys[0]
  if (!jwk) {
    throw new Error('No matching JWK found')
  }

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const sigBytes = Uint8Array.from(base64urlDecode(sigB64), c => c.charCodeAt(0))
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, sigBytes, data)
  if (!valid) {
    throw new Error('Invalid JWT signature')
  }

  return { email: payload.email }
}
