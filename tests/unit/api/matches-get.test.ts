// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createMockDB } from '../../helpers/mock-db'
import { createMockEvent } from '../../helpers/mock-event'
import handler from '../../../server/api/matches.get'

const RECENT_MATCHES = [
  {
    id: 5,
    played_at: '2026-04-01T12:00:00.000Z',
    deck1_name: 'サムライ魂',
    deck2_name: 'ドラゴン炎',
    winner_name: 'サムライ魂',
  },
  {
    id: 4,
    played_at: '2026-03-30T10:00:00.000Z',
    deck1_name: 'ドラゴン炎',
    deck2_name: 'サムライ魂',
    winner_name: 'ドラゴン炎',
  },
]

describe('GET /api/matches', () => {
  it('直近の対戦結果を返す', async () => {
    const db = createMockDB(RECENT_MATCHES)
    const result = await handler(createMockEvent({ db }))

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      id: 5,
      deck1_name: 'サムライ魂',
      deck2_name: 'ドラゴン炎',
      winner_name: 'サムライ魂',
    })
  })

  it('対戦実績がない場合は空配列を返す', async () => {
    const db = createMockDB([])
    const result = await handler(createMockEvent({ db }))
    expect(result).toEqual([])
  })
})
