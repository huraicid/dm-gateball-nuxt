// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createMockEvent } from '../../../helpers/mock-event'
import handler from '../../../../server/api/auth/login.post'

afterEach(() => vi.unstubAllGlobals())

describe('POST /api/auth/login', () => {
  it('環境変数が未設定の場合は 500 を返す', async () => {
    vi.stubGlobal('readBody', vi.fn().mockResolvedValue({ username: 'admin', password: 'pass' }))
    vi.stubGlobal('setCookie', vi.fn())

    const event = {
      context: { cloudflare: { env: {} } },
    } as any

    await expect(handler(event)).rejects.toMatchObject({ statusCode: 500 })
  })

  it('ユーザー名が違う場合は 401 を返す', async () => {
    vi.stubGlobal('readBody', vi.fn().mockResolvedValue({ username: 'wrong', password: 'password' }))
    vi.stubGlobal('setCookie', vi.fn())

    await expect(handler(createMockEvent())).rejects.toMatchObject({ statusCode: 401 })
  })

  it('パスワードが違う場合は 401 を返す', async () => {
    vi.stubGlobal('readBody', vi.fn().mockResolvedValue({ username: 'admin', password: 'wrong' }))
    vi.stubGlobal('setCookie', vi.fn())

    await expect(handler(createMockEvent())).rejects.toMatchObject({ statusCode: 401 })
  })

  it('正しい認証情報で Cookie をセットして { ok: true } を返す', async () => {
    vi.stubGlobal('readBody', vi.fn().mockResolvedValue({ username: 'admin', password: 'password' }))
    const setCookieMock = vi.fn()
    vi.stubGlobal('setCookie', setCookieMock)

    const result = await handler(createMockEvent())

    expect(result).toEqual({ ok: true })
    expect(setCookieMock).toHaveBeenCalledOnce()
    // Cookie 名の確認
    expect(setCookieMock.mock.calls[0][1]).toBe('dm_session')
    // トークンが文字列であること
    expect(typeof setCookieMock.mock.calls[0][2]).toBe('string')
  })
})
