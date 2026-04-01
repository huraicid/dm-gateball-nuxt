<script setup lang="ts">
export interface MatchResult {
  wins: number
  losses: number
}

const props = defineProps<{
  decks: string[]
  results: (MatchResult | null)[][]
}>()

function getWinRate(result: MatchResult | null): number | null {
  if (!result) return null
  const total = result.wins + result.losses
  if (total === 0) return null
  return (result.wins / total) * 100
}

function formatCell(result: MatchResult | null): { rate: string, detail: string } | null {
  if (!result) return null
  const total = result.wins + result.losses
  if (total === 0) return null
  const rate = ((result.wins / total) * 100).toFixed(1)
  return { rate: `${rate}%`, detail: `(${result.wins}/${total})` }
}

function cellClass(result: MatchResult | null): string {
  const rate = getWinRate(result)
  if (rate === null) return 'cell-neutral'
  if (rate >= 60) return 'cell-favorable'
  if (rate >= 45) return 'cell-even'
  return 'cell-unfavorable'
}
</script>

<template>
  <div class="matchup-table-wrapper">
    <table class="matchup-table">
      <thead>
        <tr>
          <th class="corner-cell"></th>
          <th v-for="deck in props.decks" :key="deck" class="header-cell">
            {{ deck }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in props.results" :key="props.decks[i]">
          <th class="row-header">{{ props.decks[i] }}</th>
          <td
            v-for="(cell, j) in row"
            :key="j"
            :class="cellClass(cell)"
          >
            <template v-if="formatCell(cell)">
              <span class="cell-rate">{{ formatCell(cell)!.rate }}</span>
              <span class="cell-detail">{{ formatCell(cell)!.detail }}</span>
            </template>
            <template v-else>-</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.matchup-table-wrapper {
  overflow-x: auto;
}

.matchup-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.875rem;
}

.matchup-table th,
.matchup-table td {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  text-align: center;
  white-space: nowrap;
}

.corner-cell {
  background: #f9fafb;
}

.header-cell {
  background: #f3f4f6;
  font-weight: 600;
  min-width: 120px;
}

.row-header {
  background: #f3f4f6;
  font-weight: 600;
  text-align: left;
  min-width: 120px;
}

.cell-favorable {
  background: #dcfce7;
  color: #166534;
  font-weight: 500;
}

.cell-unfavorable {
  background: #fee2e2;
  color: #991b1b;
  font-weight: 500;
}

.cell-even {
  background: #fef9c3;
  color: #854d0e;
  font-weight: 500;
}

.cell-neutral {
  background: #f3f4f6;
  color: #9ca3af;
}

.cell-rate {
  display: block;
  font-size: 0.875rem;
}

.cell-detail {
  display: block;
  font-size: 0.75rem;
  opacity: 0.75;
}
</style>
