// @vitest-environment nuxt
import { describe, it, expect, vi } from 'vitest'
import { renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import IndexPage from '../../../app/pages/index.vue'

mockNuxtImport('useFetch', () =>
  vi.fn().mockImplementation((url: string) => {
    if (url === '/api/results') {
      return {
        data: ref({
          decks: [
            { id: 'DMC-36', name: 'サムライ魂' },
            { id: 'DMC-37', name: 'ドラゴン炎' },
          ],
          results: [
            [null, { wins: 3, losses: 1 }],
            [{ wins: 1, losses: 3 }, null],
          ],
        }),
      }
    }
    if (url === '/api/matches') {
      return {
        data: ref([
          {
            id: 1,
            played_at: '2026-04-01T00:00:00.000Z',
            deck1_name: 'サムライ魂',
            deck2_name: 'ドラゴン炎',
            winner_name: 'サムライ魂',
          },
        ]),
      }
    }
    return { data: ref(null) }
  }),
)

describe('pages/index.vue', () => {
  it('ページ見出しを表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    expect(wrapper.html()).toContain('DM構築済みデッキ相性 勝敗表')
  })

  it('MatchupTable を表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    expect(wrapper.container.querySelector('table')).not.toBeNull()
  })

  it('直近の対戦結果セクションを表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    expect(wrapper.html()).toContain('直近の対戦結果')
  })

  it('対戦結果に勝者名を表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    expect(wrapper.html()).toContain('サムライ魂 勝利')
  })

  it('勝率ランキングセクションを表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    expect(wrapper.html()).toContain('勝率ランキング')
  })

  it('ランキングを勝率降順で表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    const html = wrapper.html()
    const pos36 = html.indexOf('サムライ魂')
    const pos37 = html.indexOf('ドラゴン炎')
    // サムライ魂(75%)がドラゴン炎(25%)より先に出現する
    // ただし勝敗表の見出し行より後のランキング部分で比較するため
    // ランキングセクション内の順序をチェック
    const rankingSection = html.slice(html.indexOf('勝率ランキング'))
    expect(rankingSection.indexOf('サムライ魂')).toBeLessThan(rankingSection.indexOf('ドラゴン炎'))
  })

  it('ランキングに勝率・勝数・敗数を表示する', async () => {
    const wrapper = await renderSuspended(IndexPage)
    const rankingSection = wrapper.html().slice(wrapper.html().indexOf('勝率ランキング'))
    expect(rankingSection).toContain('75.0%')
    expect(rankingSection).toContain('3勝')
    expect(rankingSection).toContain('1敗')
  })
})
