// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createMockDB } from '../../helpers/mock-db'
import { createMockEvent } from '../../helpers/mock-event'
import handler from '../../../server/api/decks'

describe('GET /api/decks', () => {
  it('デッキ一覧を id 昇順で返す', async () => {
    const db = createMockDB([
      { id: 'DMC-36', name: 'サムライ魂' },
      { id: 'DMC-37', name: 'ドラゴン炎' },
    ])
    const result = await handler(createMockEvent({ db }))
    expect(result).toEqual([
      { id: 'DMC-36', name: 'サムライ魂' },
      { id: 'DMC-37', name: 'ドラゴン炎' },
    ])
  })

  it('デッキが 0 件の場合は空配列を返す', async () => {
    const db = createMockDB([])
    const result = await handler(createMockEvent({ db }))
    expect(result).toEqual([])
  })
})
