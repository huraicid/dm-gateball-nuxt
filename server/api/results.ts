export default defineEventHandler(() => {
  const decks = [
    '赤単アグロ',
    '青白コントロール',
    '黒緑ミッドレンジ',
    '赤青テンポ',
    '白単ウィニー',
  ]

  // results[行(自分)][列(相手)]
  const results = [
    [null, { wins: 13, losses: 7 }, { wins: 8, losses: 12 }, { wins: 10, losses: 10 }, { wins: 14, losses: 6 }],
    [{ wins: 7, losses: 13 }, null, { wins: 15, losses: 5 }, { wins: 9, losses: 11 }, { wins: 11, losses: 9 }],
    [{ wins: 12, losses: 8 }, { wins: 5, losses: 15 }, null, { wins: 14, losses: 6 }, { wins: 10, losses: 10 }],
    [{ wins: 10, losses: 10 }, { wins: 11, losses: 9 }, { wins: 6, losses: 14 }, null, { wins: 12, losses: 8 }],
    [{ wins: 6, losses: 14 }, { wins: 9, losses: 11 }, { wins: 10, losses: 10 }, { wins: 8, losses: 12 }, null],
  ]

  return { decks, results }
})
