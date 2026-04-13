import { describe, it, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'
import MatchupTable from '../../app/components/MatchupTable.vue'
import type { MatchResult, Deck } from '../../app/components/MatchupTable.vue'

config.global.stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
}

const TWO_DECKS: Deck[] = [
  { id: 'deck-a', name: 'デッキA' },
  { id: 'deck-b', name: 'デッキB' },
]

function makeResults(cells: (MatchResult | null)[][]): (MatchResult | null)[][] {
  return cells
}

describe('MatchupTable', () => {
  describe('ヘッダーのレンダリング', () => {
    it('列ヘッダーにデッキ名を表示する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      const headerCells = wrapper.findAll('th.header-cell')
      expect(headerCells).toHaveLength(2)
    })

    it('行ヘッダーにデッキ名を表示する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      const rowHeaders = wrapper.findAll('th.row-header')
      expect(rowHeaders).toHaveLength(2)
      expect(rowHeaders[0].text()).toContain('デッキA')
      expect(rowHeaders[1].text()).toContain('デッキB')
    })
  })

  describe('デッキリンク', () => {
    it('列ヘッダーのデッキ名がデッキ詳細ページへのリンクになっている', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      const links = wrapper.findAll('th.header-cell a')
      expect(links[0].attributes('href')).toBe('/decks/deck-a')
      expect(links[1].attributes('href')).toBe('/decks/deck-b')
    })

    it('行ヘッダーのデッキ名がデッキ詳細ページへのリンクになっている', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      const links = wrapper.findAll('th.row-header a')
      expect(links[0].attributes('href')).toBe('/decks/deck-a')
      expect(links[1].attributes('href')).toBe('/decks/deck-b')
    })
  })

  describe('セルの表示内容', () => {
    it('null のセルは - を表示する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      const cells = wrapper.findAll('td')
      cells.forEach(cell => expect(cell.text()).toBe('-'))
    })

    it('対戦データがあるセルに勝率と試合数を表示する', () => {
      // 3勝1敗 → 75.0% (3/4)
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 3, losses: 1 }], [null, null]]),
        },
      })
      const cell = wrapper.findAll('td')[1]
      expect(cell.text()).toContain('75.0%')
      expect(cell.text()).toContain('(3/4)')
    })

    it('勝敗ともに 0 のセルは - を表示する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 0, losses: 0 }], [null, null]]),
        },
      })
      const cell = wrapper.findAll('td')[1]
      expect(cell.text()).toBe('-')
    })
  })

  describe('セルのCSSクラス（色分け）', () => {
    it('勝率 60% 以上は cell-favorable クラスを付与する', () => {
      // 3勝1敗 = 75%
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 3, losses: 1 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-favorable')
    })

    it('勝率がちょうど 60% のとき cell-favorable クラスを付与する', () => {
      // 3勝2敗 = 60%
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 3, losses: 2 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-favorable')
    })

    it('勝率 45% 以上 60% 未満は cell-even クラスを付与する', () => {
      // 1勝1敗 = 50%
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 1, losses: 1 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-even')
    })

    it('勝率がちょうど 45% のとき cell-even クラスを付与する', () => {
      // 9勝11敗 = 45%
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 9, losses: 11 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-even')
    })

    it('勝率 45% 未満は cell-unfavorable クラスを付与する', () => {
      // 1勝3敗 = 25%
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 1, losses: 3 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-unfavorable')
    })

    it('null のセルは cell-neutral クラスを付与する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, null], [null, null]]),
        },
      })
      wrapper.findAll('td').forEach(cell => {
        expect(cell.classes()).toContain('cell-neutral')
      })
    })

    it('勝敗ともに 0 のセルは cell-neutral クラスを付与する', () => {
      const wrapper = mount(MatchupTable, {
        props: {
          decks: TWO_DECKS,
          results: makeResults([[null, { wins: 0, losses: 0 }], [null, null]]),
        },
      })
      expect(wrapper.findAll('td')[1].classes()).toContain('cell-neutral')
    })
  })
})
