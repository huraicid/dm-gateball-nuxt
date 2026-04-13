// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import DeckDetailPage from '../../../../app/pages/decks/[id].vue'

mockNuxtImport('useRoute', () =>
  vi.fn().mockReturnValue({ params: { id: 'DMC-36' } }),
)

mockNuxtImport('useFetch', () =>
  vi.fn().mockImplementation((url: string) => {
    if (url === '/api/decks') {
      return {
        data: ref([
          { id: 'DMC-36', name: 'ヘヴン・オブ・ドラゴン' },
        ]),
      }
    }
    if (url === '/api/decks/DMC-36/cards') {
      return {
        data: ref([
          { id: 1, card_id: '1/110', card_name: 'ボルメテウス・ホワイト・ドラゴン', quantity: 1 },
          { id: 2, card_id: '2/110', card_name: 'ボルメテウス・サファイア・ドラゴン', quantity: 2 },
        ]),
      }
    }
    return { data: ref(null) }
  }),
)

describe('pages/decks/[id].vue', () => {
  it('デッキ名を表示する', async () => {
    const wrapper = await renderSuspended(DeckDetailPage)
    expect(wrapper.html()).toContain('ヘヴン・オブ・ドラゴン')
  })

  it('カード一覧テーブルを表示する', async () => {
    const wrapper = await renderSuspended(DeckDetailPage)
    expect(wrapper.container.querySelector('table')).not.toBeNull()
  })

  it('カードIDを表示する', async () => {
    const wrapper = await renderSuspended(DeckDetailPage)
    expect(wrapper.html()).toContain('1/110')
  })

  it('カード名を表示する', async () => {
    const wrapper = await renderSuspended(DeckDetailPage)
    expect(wrapper.html()).toContain('ボルメテウス・ホワイト・ドラゴン')
  })

  it('枚数を表示する', async () => {
    const wrapper = await renderSuspended(DeckDetailPage)
    expect(wrapper.html()).toContain('2')
  })
})
