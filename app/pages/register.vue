<script setup lang="ts">
const { data: decks } = await useFetch('/api/decks')

const deck1Id = ref('')
const deck2Id = ref('')
const winnerId = ref('')
const submitting = ref(false)
const successCount = ref(0)
const errorMessage = ref('')

const deck1 = computed(() => decks.value?.find(d => d.id === deck1Id.value))
const deck2 = computed(() => decks.value?.find(d => d.id === deck2Id.value))

const canSubmit = computed(() =>
  deck1Id.value && deck2Id.value && deck1Id.value !== deck2Id.value && winnerId.value,
)

watch([deck1Id, deck2Id], () => {
  winnerId.value = ''
})

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/matches', {
      method: 'POST',
      body: { deck1_id: deck1Id.value, deck2_id: deck2Id.value, winner_id: winnerId.value },
    })
    successCount.value++
    deck1Id.value = ''
    deck2Id.value = ''
    winnerId.value = ''
  }
  catch (e: any) {
    errorMessage.value = e?.data?.message ?? '登録に失敗しました'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <h1>成績登録</h1>

    <div v-if="successCount > 0" class="success-banner">
      登録しました（{{ successCount }}件）
    </div>

    <div class="form">
      <label class="field">
        <span class="label">デッキ1</span>
        <select v-model="deck1Id" class="select">
          <option value="">選択してください</option>
          <option
            v-for="d in decks"
            :key="d.id"
            :value="d.id"
            :disabled="d.id === deck2Id"
          >
            {{ d.name }}
          </option>
        </select>
      </label>

      <label class="field">
        <span class="label">デッキ2</span>
        <select v-model="deck2Id" class="select">
          <option value="">選択してください</option>
          <option
            v-for="d in decks"
            :key="d.id"
            :value="d.id"
            :disabled="d.id === deck1Id"
          >
            {{ d.name }}
          </option>
        </select>
      </label>

      <div v-if="deck1Id && deck2Id && deck1Id !== deck2Id" class="field">
        <span class="label">勝者</span>
        <div class="winner-buttons">
          <button
            class="winner-btn"
            :class="{ selected: winnerId === deck1Id }"
            type="button"
            @click="winnerId = deck1Id"
          >
            {{ deck1?.name }}
          </button>
          <button
            class="winner-btn"
            :class="{ selected: winnerId === deck2Id }"
            type="button"
            @click="winnerId = deck2Id"
          >
            {{ deck2?.name }}
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button
        class="submit-btn"
        :disabled="!canSubmit || submitting"
        type="button"
        @click="submit"
      >
        {{ submitting ? '登録中...' : '登録する' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.success-banner {
  background: #d1fae5;
  color: #065f46;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.select {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  appearance: auto;
}

.winner-buttons {
  display: flex;
  gap: 0.75rem;
}

.winner-btn {
  flex: 1;
  padding: 1rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  cursor: pointer;
  text-align: center;
  word-break: break-all;
  transition: border-color 0.15s, background 0.15s;
}

.winner-btn.selected {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}

.submit-btn {
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
