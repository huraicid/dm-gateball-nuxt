import { describe, it, expect, vi, afterEach } from 'vitest'
import { createSessionToken, verifySessionToken } from '../../server/utils/session'

describe('createSessionToken', () => {
  it('auth: プレフィックスと署名を含むトークンを返す', async () => {
    const token = await createSessionToken('test-secret')
    expect(token).toMatch(/^auth:\d+\..+$/)
  })

  it('生成したトークンを同じシークレットで検証できる', async () => {
    const secret = 'test-secret'
    const token = await createSessionToken(secret)
    expect(await verifySessionToken(token, secret)).toBe(true)
  })
})

describe('verifySessionToken', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('undefined を渡すと false を返す', async () => {
    expect(await verifySessionToken(undefined, 'secret')).toBe(false)
  })

  it('ドットのないトークンは false を返す', async () => {
    expect(await verifySessionToken('auth:9999999999', 'secret')).toBe(false)
  })

  it('署名を改ざんしたトークンは false を返す', async () => {
    const secret = 'test-secret'
    const token = await createSessionToken(secret)
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(await verifySessionToken(tampered, secret)).toBe(false)
  })

  it('異なるシークレットで検証すると false を返す', async () => {
    const token = await createSessionToken('secret-a')
    expect(await verifySessionToken(token, 'secret-b')).toBe(false)
  })

  it('有効期限切れのトークンは false を返す', async () => {
    const secret = 'test-secret'
    // SESSION_DURATION は 7日間なので、8日前に作ったトークンは期限切れ
    vi.useFakeTimers()
    vi.setSystemTime(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000))
    const expiredToken = await createSessionToken(secret)
    vi.useRealTimers()

    expect(await verifySessionToken(expiredToken, secret)).toBe(false)
  })

  it('データ部分を改ざんしたトークンは false を返す', async () => {
    const secret = 'test-secret'
    const token = await createSessionToken(secret)
    // 有効期限を遠い未来に書き換える（署名は元のまま）
    const lastDot = token.lastIndexOf('.')
    const sig = token.slice(lastDot)
    const tamperedData = `auth:9999999999${sig}`
    expect(await verifySessionToken(tamperedData, secret)).toBe(false)
  })

  it('auth: プレフィックスのない形式のトークンは false を返す', async () => {
    // split(':') でインデックス1が undefined になるケース
    expect(await verifySessionToken('invalid:9999999999.fakesig', 'secret')).toBe(false)
  })
})
