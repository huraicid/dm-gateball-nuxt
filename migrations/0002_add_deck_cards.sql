-- デッキリストテーブル
CREATE TABLE IF NOT EXISTS deck_cards (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  deck_id   TEXT    NOT NULL REFERENCES decks(id),
  card_id   TEXT    NOT NULL,
  card_name TEXT    NOT NULL,
  quantity  INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 4),
  UNIQUE (deck_id, card_id)
);

INSERT INTO deck_cards (deck_id, card_id, card_name, quantity) VALUES
-- ヘヴン・オブ・ドラゴン
('DMC-36', '6/28', '紅神龍バルガゲイザー', 4),
('DMC-36', '3/28', 'バルキリー・ドラゴン', 3),
('DMC-36', '5/28', 'アルティメット・ドラゴン', 2),
('DMC-36', '4/28', 'ボルメテウス・ホワイト・ドラゴン', 1),
('DMC-36', '18/28', '地獄スクラッパー', 4),
('DMC-36', '17/28', 'インフィニティ・ドラゴン', 2),
('DMC-36', '20/28', 'アンビシャス・ドラゴン', 4),
('DMC-36', '21/28', '紅神龍ガルドス', 4),
('DMC-36', '19/28', 'コッコ・ルピア', 4),
('DMC-36', '23/28', 'チッタ・ペロル', 4),
('DMC-36', '28/28', 'トット・ピピッチ', 2),
('DMC-36', '27/28', 'フレミングジェット・ドラゴン', 2),
('DMC-36', '16/28', 'デーモン・ハンド', 4);