<script setup lang="ts">
const { data } = await useFetch('/api/results')
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
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}
</style>
