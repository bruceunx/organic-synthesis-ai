import { Database } from 'better-sqlite3'

export const saveFlow = async (
  db: Database,
  target: string,
  content: string,
) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(
        'INSERT INTO reaction(target, content) VALUES (@target, @content)',
      )
      const result = stmt.run({ target, content })
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

export const updateFlow = async (db: Database, id: number, content: string) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(
        'UPDATE reaction SET content = @content WHERE id = @id',
      )
      const result = stmt.run({ content, id })
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

export const getFlowList = async (db: Database) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare('SELECT id, time_stamp,target FROM reaction')
      const result = stmt.all()
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

export const getFlow = async (db: Database, id: number) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare('SELECT * FROM reaction where id = ?')
      const result = stmt.get(id)
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

export const delFlow = async (db: Database, id: number) => {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare('DELETE FROM reaction WHERE id = ?')
      const result = stmt.run(id)
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}
