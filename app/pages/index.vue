<script setup lang="ts">
const { data } = await useFetch('/api/results')
const { data: recentMatches } = await useFetch('/api/matches')

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
