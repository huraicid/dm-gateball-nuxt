-- デッキリストテーブル
CREATE TABLE IF NOT EXISTS deck_cards (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  deck_id   TEXT    NOT NULL REFERENCES decks(id),
  card_id   TEXT    NOT NULL,
  card_name TEXT    NOT NULL,
  quantity  INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 4),
  UNIQUE (deck_id, card_id)
);
