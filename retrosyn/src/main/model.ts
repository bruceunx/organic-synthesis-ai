import Database from 'better-sqlite3'

export function initDB(): Database.Database {
  const db = new Database('test.db')
  const sql = `
    CREATE TABLE IF NOT EXISTS reaction (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      target VARCHAR(255) NOT NULL,
      content TEXT
    )
  `

  const trigger = `
    CREATE TRIGGER IF NOT EXISTS time_stamp_trigger
    AFTER UPDATE ON reaction
    FOR EACH ROW
    BEGIN
        UPDATE reaction
        SET time_stamp = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END
  `

  db.prepare(sql).run()
  db.prepare(trigger).run()

  // improve performance
  db.pragma('journal_mode = WAL')

  // const tableInfo = db.prepare('PRAGMA table_info(reaction)').all()
  return db
}
