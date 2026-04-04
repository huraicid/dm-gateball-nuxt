import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['tests/setup/server-globals.ts'],
    environmentMatchGlobs: [
      ['tests/unit/pages/**', 'nuxt'],
      ['tests/unit/matchup-table.test.ts', 'nuxt'],
    ],
  },
})
