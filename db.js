const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./caixa.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      valor REAL NOT NULL,
      foto TEXT
    )
  `);
});