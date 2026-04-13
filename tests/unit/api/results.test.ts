// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createMockDB } from '../../helpers/mock-db'
import { createMockEvent } from '../../helpers/mock-event'
import handler from '../../../server/api/results'

const DECKS = [
  { id: 'DMC-36', name: 'サムライ魂' },
  { id: 'DMC-37', name: 'ドラゴン炎' },
]

describe('GET /api/results', () => {
  it('デッキ名リストと勝敗マトリクスを返す', async () => {
    const matchStats = [
      { deck_id: 'DMC-36', opponent_id: 'DMC-37', wins: 3, losses: 1 },
      { deck_id: 'DMC-37', opponent_id: 'DMC-36', wins: 1, losses: 3 },
    ]
    const db = createMockDB(DECKS, matchStats)

    const result = await handler(createMockEvent({ db }))

    expect(result.decks).toEqual([
      { id: 'DMC-36', name: 'サムライ魂' },
      { id: 'DMC-37', name: 'ドラゴン炎' },
    ])
    // サムライ魂 vs ドラゴン炎: 3勝1敗
    expect(result.results[0][1]).toEqual({ wins: 3, losses: 1 })
    // ドラゴン炎 vs サムライ魂: 1勝3敗
    expect(result.results[1][0]).toEqual({ wins: 1, losses: 3 })
  })

  it('対角セル（同一デッキ）は null を返す', async () => {
    const db = createMockDB(DECKS, [
      { deck_id: 'DMC-36', opponent_id: 'DMC-37', wins: 0, losses: 0 },
      { deck_id: 'DMC-37', opponent_id: 'DMC-36', wins: 0, losses: 0 },
    ])

    const result = await handler(createMockEvent({ db }))

    expect(result.results[0][0]).toBeNull()
    expect(result.results[1][1]).toBeNull()
  })

  it('対戦実績がない場合はすべて wins: 0 / losses: 0 を返す', async () => {
    const db = createMockDB(DECKS, [
      { deck_id: 'DMC-36', opponent_id: 'DMC-37', wins: 0, losses: 0 },
      { deck_id: 'DMC-37', opponent_id: 'DMC-36', wins: 0, losses: 0 },
    ])

    const result = await handler(createMockEvent({ db }))

    expect(result.results[0][1]).toEqual({ wins: 0, losses: 0 })
  })
})
