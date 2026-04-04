import type { createMockDB } from './mock-db'

type MockDB = ReturnType<typeof createMockDB>

interface MockEventOptions {
  db?: MockDB
  sessionSecret?: string
  adminUsername?: string
  adminPassword?: string
}

/**
 * API ハンドラーに渡す最小限の H3Event モック。
 * event.context.cloudflare.env に必要な値を設定する。
 */
export function createMockEvent(options: MockEventOptions = {}) {
  return {
    context: {
      cloudflare: {
        env: {
          DB: options.db,
          SESSION_SECRET: options.sessionSecret ?? 'test-secret',
          ADMIN_USERNAME: options.adminUsername ?? 'admin',
          ADMIN_PASSWORD: options.adminPassword ?? 'password',
        },
      },
    },
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any
}
