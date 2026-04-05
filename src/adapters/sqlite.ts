import type { BannerAdapter, ConsentDecision, ConsentRecordData } from '../types'

export interface SQLiteAdapterOptions {
  path?: string
}

export function SQLiteAdapter(options: SQLiteAdapterOptions = {}): BannerAdapter {
  let db: any
  try {
    const Database = require('better-sqlite3')
    const dbPath = (options as any).path ?? './data/banner.db'
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
  } catch {
    throw new Error('better-sqlite3 is required. Install with: npm install better-sqlite3')
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS consent_records (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      decision TEXT NOT NULL,
      categories TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL
    )
  `)

  return {
    async getConsent(userId?: string): Promise<ConsentRecordData | null> {
      let stmt: any
      if (userId) {
        stmt = db.prepare(
          'SELECT * FROM consent_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
        )
        const row: any = stmt.get(userId)
        if (!row) return null
        return {
          id: row.id,
          userId: row.user_id,
          decision: row.decision as ConsentDecision,
          categories: JSON.parse(row.categories),
          createdAt: row.created_at,
        }
      } else {
        stmt = db.prepare(
          'SELECT * FROM consent_records ORDER BY created_at DESC LIMIT 1'
        )
        const row: any = stmt.get()
        if (!row) return null
        return {
          id: row.id,
          userId: row.user_id,
          decision: row.decision as ConsentDecision,
          categories: JSON.parse(row.categories),
          createdAt: row.created_at,
        }
      }
    },

    async recordConsent(
      userId: string | undefined,
      decision: ConsentDecision,
      categories: string[]
    ): Promise<ConsentRecordData> {
      const { nanoid } = require('nanoid')
      const id = nanoid()
      const createdAt = Date.now()

      const stmt = db.prepare(`
        INSERT INTO consent_records (id, user_id, decision, categories, created_at)
        VALUES (?, ?, ?, ?, ?)
      `)
      stmt.run(id, userId ?? null, decision, JSON.stringify(categories), createdAt)

      return {
        id,
        userId: userId ?? null,
        decision,
        categories,
        createdAt,
      }
    },
  }
}
