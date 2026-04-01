-- デッキテーブル
CREATE TABLE IF NOT EXISTS decks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 対戦結果テーブル
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deck1_id TEXT NOT NULL REFERENCES decks(id),
  deck2_id TEXT NOT NULL REFERENCES decks(id),
  winner_id TEXT NOT NULL REFERENCES decks(id),
  played_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- シードデータ: デッキ
INSERT INTO decks (id, name) VALUES
('DMC-01', '赤単アグロ'),
('DMC-02', '青白コントロール'),
('DMC-03', '黒緑ミッドレンジ'),
('DMC-04', '赤青テンポ'),
('DMC-05', '白単ウィニー');

-- シードデータ: 対戦結果
INSERT INTO matches (deck1_id, deck2_id, winner_id) VALUES
('DMC-01', 'DMC-02', 'DMC-01'),
('DMC-01', 'DMC-02', 'DMC-01'),
('DMC-01', 'DMC-02', 'DMC-01'),
('DMC-01', 'DMC-02', 'DMC-01'),
('DMC-05', 'DMC-04', 'DMC-05');
