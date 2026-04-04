// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createSessionToken } from '../../../server/utils/session'
import { createMockDB } from '../../helpers/mock-db'
import { createMockEvent } from '../../helpers/mock-event'
import handler from '../../../server/api/matches.post'

afterEach(() => vi.unstubAllGlobals())

const SECRET = 'test-secret'

describe('POST /api/matches', () => {
  describe('認証チェック', () => {
    it('Cookie がない場合は 401 を返す', async () => {
      vi.stubGlobal('getCookie', vi.fn().mockReturnValue(undefined))
      vi.stubGlobal('readBody', vi.fn().mockResolvedValue({}))

      const event = createMockEvent({ sessionSecret: SECRET })
      await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
    })

    it('無効な Cookie の場合は 401 を返す', async () => {
      vi.stubGlobal('getCookie', vi.fn().mockReturnValue('invalid-token'))
      vi.stubGlobal('readBody', vi.fn().mockResolvedValue({}))

      const event = createMockEvent({ sessionSecret: SECRET })
      await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
    })
  })

  describe('バリデーション', () => {
    async function callWithValidSession(body: Record<string, unknown>) {
      const token = await createSessionToken(SECRET)
      vi.stubGlobal('getCookie', vi.fn().mockReturnValue(token))
      vi.stubGlobal('readBody', vi.fn().mockResolvedValue(body))
      const db = createMockDB()
      return handler(createMockEvent({ db, sessionSecret: SECRET }))
    }

    it('deck1_id が未指定の場合は 400 を返す', async () => {
      await expect(
        callWithValidSession({ deck2_id: 'DMC-37', winner_id: 'DMC-37' }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('deck2_id が未指定の場合は 400 を返す', async () => {
      await expect(
        callWithValidSession({ deck1_id: 'DMC-36', winner_id: 'DMC-36' }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('winner_id が未指定の場合は 400 を返す', async () => {
      await expect(
        callWithValidSession({ deck1_id: 'DMC-36', deck2_id: 'DMC-37' }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('deck1 と deck2 が同じ場合は 400 を返す', async () => {
      await expect(
        callWithValidSession({ deck1_id: 'DMC-36', deck2_id: 'DMC-36', winner_id: 'DMC-36' }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })

    it('winner_id が deck1/deck2 以外の場合は 400 を返す', async () => {
      await expect(
        callWithValidSession({ deck1_id: 'DMC-36', deck2_id: 'DMC-37', winner_id: 'DMC-99' }),
      ).rejects.toMatchObject({ statusCode: 400 })
    })
  })

  describe('正常系', () => {
    it('有効なリクエストで DB に挿入して { ok: true } を返す', async () => {
      const token = await createSessionToken(SECRET)
      vi.stubGlobal('getCookie', vi.fn().mockReturnValue(token))
      vi.stubGlobal('readBody', vi.fn().mockResolvedValue({
        deck1_id: 'DMC-36',
        deck2_id: 'DMC-37',
        winner_id: 'DMC-36',
      }))
      const db = createMockDB()
      const event = createMockEvent({ db, sessionSecret: SECRET })

      const result = await handler(event)

      expect(result).toEqual({ ok: true })
      expect(db.prepare).toHaveBeenCalledOnce()
    })
  })
})
