import { vi } from 'vitest'

type D1Row = Record<string, unknown>

/**
 * Cloudflare D1 のモック。
 * 引数に渡した rowSets[0], rowSets[1], ... の順に
 * prepare().all() / prepare().bind().all() の戻り値として使用される。
 * run() は常に成功する。
 */
export function createMockDB(...rowSets: D1Row[][]) {
  let callIndex = 0

  const makeStatement = (rows: D1Row[]) => {
    const stmt: Record<string, unknown> = {
      all: vi.fn().mockResolvedValue({ results: rows }),
      run: vi.fn().mockResolvedValue({ success: true }),
    }
    stmt.bind = vi.fn().mockImplementation((..._args: unknown[]) => stmt)
    return stmt
  }

  return {
    prepare: vi.fn().mockImplementation((_sql: string) => {
      return makeStatement(rowSets[callIndex++] ?? [])
    }),
  }
}
