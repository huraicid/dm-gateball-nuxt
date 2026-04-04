/**
 * Nitro は auto-import により defineEventHandler / getCookie 等を
 * グローバルスコープに注入するが、テスト環境では行われないため
 * ここで明示的に globalThis に割り当てる。
 *
 * API ハンドラーはこれらを「束縛なし参照」として使用するため、
 * globalThis に存在すれば正常に動作する。
 */
import { defineEventHandler, getCookie, setCookie, readBody, createError } from 'h3'

Object.assign(globalThis, {
  defineEventHandler,
  getCookie,
  setCookie,
  readBody,
  createError,
})
