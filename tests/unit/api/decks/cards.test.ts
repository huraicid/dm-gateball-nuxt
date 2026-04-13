// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createMockDB } from '../../../helpers/mock-db'
import { createMockEvent } from '../../../helpers/mock-event'
import handler from '../../../../server/api/decks/[id]/cards'

describe('GET /api/decks/:id/cards', () => {
  it('デッキのカード一覧を返す', async () => {
    const cards = [
      { id: 1, card_id: '1/110', card_name: 'ボルメテウス・ホワイト・ドラゴン', quantity: 1 },
      { id: 2, card_id: '2/110', card_name: 'ボルメテウス・サファイア・ドラゴン', quantity: 2 },
    ]
    const db = createMockDB(cards)
    const event = createMockEvent({ db })
    event.context.params = { id: 'DMC-36' }

    const result = await handler(event)

    expect(result).toEqual(cards)
  })

  it('カードが0件の場合は空配列を返す', async () => {
    const db = createMockDB([])
    const event = createMockEvent({ db })
    event.context.params = { id: 'DMC-36' }

    const result = await handler(event)

    expect(result).toEqual([])
  })
})
