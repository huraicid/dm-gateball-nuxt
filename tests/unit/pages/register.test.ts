// @vitest-environment nuxt
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import RegisterPage from '../../../app/pages/register.vue'

const authCheckHandler = vi.fn()
registerEndpoint('/api/auth/check', authCheckHandler)
registerEndpoint('/api/decks', () => [
  { id: 'DMC-36', name: 'サムライ魂' },
  { id: 'DMC-37', name: 'ドラゴン炎' },
])

beforeEach(() => {
  authCheckHandler.mockReset()
})

describe('pages/register.vue', () => {
  describe('未認証状態', () => {
    it('ログインフォームを表示する', async () => {
      authCheckHandler.mockImplementation(() => {
        throw new Error('Unauthorized')
      })

      const wrapper = await renderSuspended(RegisterPage)

      expect(wrapper.html()).toContain('ログイン')
      expect(wrapper.container.querySelector('input[type="text"]')).not.toBeNull()
      expect(wrapper.container.querySelector('input[type="password"]')).not.toBeNull()
    })
  })

  describe('認証済み状態', () => {
    it('成績登録フォームを表示する', async () => {
      authCheckHandler.mockImplementation(() => ({ ok: true }))

      const wrapper = await renderSuspended(RegisterPage)

      expect(wrapper.html()).toContain('成績登録')
      expect(wrapper.container.querySelectorAll('select')).toHaveLength(2)
    })
  })
})
