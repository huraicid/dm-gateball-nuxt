<script setup lang="ts">
import { computed } from 'vue'

const { data } = await useFetch('/api/results')
const { data: recentMatches } = await useFetch('/api/matches')

const rankings = computed(() => {
  if (!data.value) return []
  const { decks, results } = data.value
  return decks.map((deck, i) => {
    let wins = 0
    let losses = 0
    for (let j = 0; j < decks.length; j++) {
      const cell = results[i][j]
      if (cell) {
        wins += cell.wins
        losses += cell.losses
      }
    }
    const total = wins + losses
    const winRate = total > 0 ? (wins / total) * 100 : null
    return { deck, wins, losses, total, winRate }
  }).sort((a, b) => {
    if (a.winRate === null && b.winRate === null) return 0
    if (a.winRate === null) return 1
    if (b.winRate === null) return -1
    return b.winRate - a.winRate
  })
})

function formatDate(playedAt: string): string {
  return new Date(playedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="page-container">
    <h1>DM構築済みデッキ相性 勝敗表</h1>
    <p class="description">行のデッキから見た、列のデッキに対する勝率です。</p>
    <MatchupTable
      v-if="data"
      :decks="data.decks"
      :results="data.results"
    />

    <section v-if="rankings.length > 0" class="ranking">
      <h2>勝率ランキング</h2>
      <table class="ranking-table">
        <thead>
          <tr>
            <th class="rank-col">順位</th>
            <th class="name-col">デッキ</th>
            <th class="stat-col">試合数</th>
            <th class="stat-col">勝</th>
            <th class="stat-col">負</th>
            <th class="stat-col">勝率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rankings" :key="row.deck.id" :class="{ 'no-games': row.winRate === null }">
            <td class="rank-col">{{ row.winRate !== null ? index + 1 : '-' }}</td>
            <td class="name-col">
              <NuxtLink :to="`/decks/${row.deck.id}`" class="deck-link">{{ row.deck.name }}</NuxtLink>
            </td>
            <td class="stat-col">{{ row.total > 0 ? row.total : '-' }}</td>
            <td class="stat-col">{{ row.total > 0 ? row.wins : '-' }}</td>
            <td class="stat-col">{{ row.total > 0 ? row.losses : '-' }}</td>
            <td class="stat-col win-rate">{{ row.winRate !== null ? `${row.winRate.toFixed(1)}%` : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="recentMatches && recentMatches.length > 0" class="recent-matches">
      <h2>直近の対戦結果</h2>
      <ul>
        <li v-for="match in recentMatches" :key="match.id" class="match-item">
          <span class="match-date">{{ formatDate(match.played_at) }}</span>
          <span class="match-decks">{{ match.deck1_name }} vs {{ match.deck2_name }}</span>
          <span class="match-winner">{{ match.winner_name }} 勝利</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.ranking {
  margin-top: 2.5rem;
}

.ranking h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.ranking-table {
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 320px;
}

.ranking-table th,
.ranking-table td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
}

.ranking-table thead th {
  background: var(--bg-surface);
  font-weight: 600;
  text-align: center;
}

.rank-col {
  text-align: center;
  width: 3rem;
}

.name-col {
  text-align: left;
}

.stat-col {
  text-align: center;
  white-space: nowrap;
}

.win-rate {
  font-weight: 600;
}

.no-games td {
  color: var(--text-muted);
}

.deck-link {
  color: inherit;
  text-decoration: none;
}

.deck-link:hover {
  text-decoration: underline;
}

.recent-matches {
  margin-top: 2.5rem;
}

.recent-matches h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.recent-matches ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.match-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.match-date {
  color: var(--text-muted);
  font-size: 0.75rem;
  white-space: nowrap;
}

.match-decks {
  flex: 1;
}

.match-winner {
  color: var(--cell-favorable-text);
  font-weight: 600;
  white-space: nowrap;
}
</style>
