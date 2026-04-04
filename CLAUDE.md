# DM Gateball

デュエル・マスターズの構築済みデッキ間の対戦成績を記録・閲覧するアプリ。

## 技術スタック

- **フレームワーク**: Nuxt 4 + Vue 3 + TypeScript
- **デプロイ**: Cloudflare Pages
- **DB**: Cloudflare D1（SQLite）
- **認証**: セッションCookie（HMAC-SHA256 署名、ライブラリなし）

## ディレクトリ構成

Nuxt 4 の構成（Nuxt 3 とは異なる）。

```
app/
  pages/
    index.vue        # 勝敗表ページ（公開）
    register.vue     # 成績登録ページ（ログイン必須）
  components/
    MatchupTable.vue # デッキ相性マトリクステーブル
  app.vue            # レイアウト
server/
  api/
    results.ts           # GET  /api/results  - 勝敗マトリクス取得
    decks.ts             # GET  /api/decks    - デッキ一覧取得
    matches.post.ts      # POST /api/matches  - 試合結果登録（要認証）
    auth/
      login.post.ts      # POST /api/auth/login  - ログイン
      check.ts           # GET  /api/auth/check  - 認証状態確認
  utils/
    session.ts           # セッションToken の生成・検証
migrations/
  0001_initial_schema.sql  # テーブル定義＋シードデータ
```

## DB スキーマ

```sql
decks  (id TEXT PK, name TEXT UNIQUE)
matches (id INTEGER PK, deck1_id, deck2_id, winner_id, played_at TEXT)
```

- `decks.id` は商品コード形式（例: `DMC-36`）
- `matches` はどちらが deck1 / deck2 かに意味はなく、同じ対戦が逆順で登録されることもある
- 勝率集計は `results.ts` で CROSS JOIN + LEFT JOIN により両方向を合算して計算

## 環境変数

Cloudflare Pages の Environment variables（本番）または `.dev.vars`（ローカル）に設定。

| 変数名 | 用途 |
|--------|------|
| `ADMIN_USERNAME` | ログインID |
| `ADMIN_PASSWORD` | ログインパスワード |
| `SESSION_SECRET` | セッションToken の HMAC 署名鍵（ランダムな長い文字列） |

D1 バインディング（`DB`）は Cloudflare Pages ダッシュボードで設定。コードでは `event.context.cloudflare.env.DB` でアクセスする。

## 認証フロー

1. `POST /api/auth/login` でID/パスワードを検証
2. 成功時に `dm_session` Cookie をセット（httpOnly, secure, 7日間有効）
3. Cookie の値は `auth:{expiry}.{HMAC署名}` 形式
4. `POST /api/matches` は毎回 Cookie を検証してから書き込む
5. `SESSION_SECRET` が未設定の場合は 500 エラー（未設定のままデプロイしない）

## 開発コマンド

```bash
# 依存関係インストール
npm install

# ローカル D1 にマイグレーション適用（初回・migration追加時）
npm run db:migrate:local

# 開発サーバー起動
npm run dev

# ビルド（Cloudflare Pages 向け）
npm run build

# 本番 D1 にマイグレーション適用
npm run db:migrate:remote

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch
```

## テスト方針

このプロジェクトは **TDD（テスト駆動開発）** を採用している。

- 新しい機能や変更を加える場合は、**先にテストを書いてから実装する**
- ソースファイルごとに対応するテストファイルを `tests/unit/` 以下に作成する
  - `server/api/*.ts` → `tests/unit/api/*.test.ts`
  - `server/utils/*.ts` → `tests/unit/*.test.ts`
  - `app/components/*.vue` → `tests/unit/*.test.ts`
  - `app/pages/*.vue` → `tests/unit/pages/*.test.ts`
- PR を作成すると GitHub Actions が自動でテストを実行する

### テスト構成

- **フレームワーク**: Vitest + `@nuxt/test-utils`
- **API ハンドラーテスト**: `tests/setup/server-globals.ts` が H3 auto-import をグローバルに提供。`vi.stubGlobal` で `getCookie` / `readBody` 等をテストごとにモック
- **ページテスト**: `renderSuspended` + `mockNuxtImport` / `registerEndpoint` で Nuxt composable と API をモック
- **D1 モック**: `tests/helpers/mock-db.ts` の `createMockDB(...rowSets)` を使用

## 開発時の注意点

- ローカル開発では `.dev.vars` に環境変数を設定する（`.dev.vars.example` 参照）
- Cloudflare D1 のローカルデータは `.wrangler/` に保存される（gitignore 済み）
- `nuxt dev` は Nitro 経由で動くため、`event.context.cloudflare.env` はローカルでも wrangler が提供する

## デッキ追加方法

新しいデッキを追加する場合は migration ファイルを追加する。

```sql
-- migrations/000X_add_deck.sql
INSERT INTO decks (id, name) VALUES ('DMC-XX', 'デッキ名');
```

その後 `npm run db:migrate:local` / `npm run db:migrate:remote` を実行。
