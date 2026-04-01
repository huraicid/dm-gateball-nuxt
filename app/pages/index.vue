<script setup lang="ts">
import type { MatchResult } from '~/components/MatchupTable.vue'

const decks = [
  '赤単アグロ',
  '青白コントロール',
  '黒緑ミッドレンジ',
  '赤青テンポ',
  '白単ウィニー',
]

// results[行(自分)][列(相手)]
const results: (MatchResult | null)[][] = [
  // 赤単アグロ vs ...
  [null, { wins: 13, losses: 7 }, { wins: 8, losses: 12 }, { wins: 10, losses: 10 }, { wins: 14, losses: 6 }],
  // 青白コントロール vs ...
  [{ wins: 7, losses: 13 }, null, { wins: 15, losses: 5 }, { wins: 9, losses: 11 }, { wins: 11, losses: 9 }],
  // 黒緑ミッドレンジ vs ...
  [{ wins: 12, losses: 8 }, { wins: 5, losses: 15 }, null, { wins: 14, losses: 6 }, { wins: 10, losses: 10 }],
  // 赤青テンポ vs ...
  [{ wins: 10, losses: 10 }, { wins: 11, losses: 9 }, { wins: 6, losses: 14 }, null, { wins: 12, losses: 8 }],
  // 白単ウィニー vs ...
  [{ wins: 6, losses: 14 }, { wins: 9, losses: 11 }, { wins: 10, losses: 10 }, { wins: 8, losses: 12 }, null],
]
</script>

<template>
  <div class="page-container">
    <h1>デッキ相性 勝敗表</h1>
    <p class="description">行のデッキから見た、列のデッキに対する勝率です。</p>
    <MatchupTable :decks="decks" :results="results" />
  </div>
</template>

<style scoped>
.page-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}
</style>
