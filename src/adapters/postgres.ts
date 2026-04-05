import type { BannerAdapter, ConsentDecision, ConsentRecordData } from '../types'

export interface PostgresAdapterOptions {
  connectionString: string
}

export function PostgresAdapter(options: PostgresAdapterOptions): BannerAdapter {
  let db: any
  try {
    const postgres = require('porsager/postgres')
    db = postgres(options.connectionString)
  } catch {
    throw new Error('porsager/postgres is required. Install with: npm install porsager/postgres')
  }

  return {
    async getConsent(userId?: string): Promise<ConsentRecordData | null> {
      let result: any
      if (userId) {
        result = await db`
          SELECT * FROM consent_records
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
          LIMIT 1
        `
      } else {
        result = await db`
          SELECT * FROM consent_records
          ORDER BY created_at DESC
          LIMIT 1
        `
      }

      const row = result[0]
      if (!row) return null

      return {
        id: row.id,
        userId: row.user_id,
        decision: row.decision as ConsentDecision,
        categories: row.categories,
        createdAt: row.created_at,
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

      const result = await db`
        INSERT INTO consent_records (id, user_id, decision, categories, created_at)
        VALUES (
          ${id},
          ${userId ?? null},
          ${decision},
          ${categories},
          ${createdAt}
        )
        RETURNING *
      `

      const row = result[0]
      return {
        id: row.id,
        userId: row.user_id,
        decision: row.decision as ConsentDecision,
        categories: row.categories,
        createdAt: row.created_at,
      }
    },
  }
}
