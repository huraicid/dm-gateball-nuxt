// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createSessionToken } from '../../../../server/utils/session'
import { createMockEvent } from '../../../helpers/mock-event'
import handler from '../../../../server/api/auth/check'

const SECRET = 'test-secret'

afterEach(() => vi.unstubAllGlobals())

describe('GET /api/auth/check', () => {
  it('Cookie がない場合は 401 を返す', async () => {
    vi.stubGlobal('getCookie', vi.fn().mockReturnValue(undefined))

    await expect(handler(createMockEvent({ sessionSecret: SECRET }))).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('無効なトークンの場合は 401 を返す', async () => {
    vi.stubGlobal('getCookie', vi.fn().mockReturnValue('invalid-token'))

    await expect(handler(createMockEvent({ sessionSecret: SECRET }))).rejects.toMatchObject({
      statusCode: 401,
    })
  })

  it('有効なトークンの場合は { ok: true } を返す', async () => {
    const token = await createSessionToken(SECRET)
    vi.stubGlobal('getCookie', vi.fn().mockReturnValue(token))

    const result = await handler(createMockEvent({ sessionSecret: SECRET }))

    expect(result).toEqual({ ok: true })
  })

  it('SESSION_SECRET が未設定の場合は 401 を返す', async () => {
    vi.stubGlobal('getCookie', vi.fn().mockReturnValue('some-token'))

    const event = { context: { cloudflare: { env: {} } } } as any
    await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
  })
})
