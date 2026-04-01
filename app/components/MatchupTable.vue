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

function isFullWidth(ch: string): boolean {
  const code = ch.charCodeAt(0)
  return code > 0x7e
}

function wrapText(text: string, maxWidth = 8): string[] {
  const lines: string[] = []
  let line = ''
  let width = 0

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const w = isFullWidth(ch) ? 1 : 0.5

    if (width + w > maxWidth && line.length > 0) {
      lines.push(line)
      line = ''
      width = 0
    }

    line += ch
    width += w
  }

  if (line) lines.push(line)
  return lines
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
            <template v-for="(line, idx) in wrapText(deck)" :key="idx">
              <br v-if="idx > 0">{{ line }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in props.results" :key="props.decks[i]">
          <th class="row-header">
            <template v-for="(line, idx) in wrapText(props.decks[i])" :key="idx">
              <br v-if="idx > 0">{{ line }}
            </template>
          </th>
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
  max-width: 100px;
}

.corner-cell {
  background: #f9fafb;
  position: sticky;
  left: 0;
  z-index: 2;
}

.header-cell {
  background: #f3f4f6;
  font-weight: 600;
  font-size: 0.75rem;
}

.row-header {
  background: #f3f4f6;
  font-weight: 600;
  text-align: left;
  font-size: 0.75rem;
  position: sticky;
  left: 0;
  z-index: 1;
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
