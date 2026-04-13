<script setup lang="ts">
const route = useRoute()
const deckId = route.params.id as string

const { data: decks } = await useFetch('/api/decks')
const { data: cards } = await useFetch(`/api/decks/${deckId}/cards`)

const deck = computed(() => decks.value?.find(d => d.id === deckId))
const totalCards = computed(() => cards.value?.reduce((sum, c) => sum + c.quantity, 0) ?? 0)
</script>

<template>
  <div class="page-container">
    <nav class="breadcrumb">
      <NuxtLink to="/">勝敗表</NuxtLink>
      <span class="separator">›</span>
      <span>{{ deck?.name ?? deckId }}</span>
    </nav>

    <h1>{{ deck?.name ?? deckId }}</h1>
    <p class="deck-id">{{ deckId }}</p>

    <section class="decklist">
      <h2>デッキリスト <span class="total">{{ totalCards }}枚</span></h2>
      <table v-if="cards && cards.length > 0" class="card-table">
        <thead>
          <tr>
            <th>カードID</th>
            <th>カード名</th>
            <th>枚数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="card.card_id">
            <td class="card-id">{{ card.card_id }}</td>
            <td class="card-name">{{ card.card_name }}</td>
            <td class="card-quantity">{{ card.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">デッキリストが登録されていません。</p>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: 600px;
}

.breadcrumb {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--border);
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.deck-id {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.decklist h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.total {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text-muted);
}

.card-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.card-table th,
.card-table td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.card-table th {
  background: var(--bg-surface);
  font-weight: 600;
}

.card-id {
  color: var(--text-muted);
  white-space: nowrap;
  width: 5rem;
}

.card-quantity {
  text-align: center;
  width: 3rem;
}

.empty {
  color: var(--text-muted);
  font-size: 0.875rem;
}
</style>
