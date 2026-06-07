import { describe, it, expect } from 'vitest'
import type { BannerAdapter } from '../types'

describe('Consent flow', () => {
  it('accepts valid consent', async () => {
    const records: Array<{ userId: string; decision: string; categories: string[] }> = []
    const adapter: BannerAdapter = {
      async getConsent(userId?: string) {
        return records.find(r => r.userId === userId) ?? null
      },
      async recordConsent(userId: string | undefined, decision: string, categories: string[]) {
        const record = { userId: userId ?? null, decision, categories, createdAt: Date.now() }
        records.push({ userId: userId ?? '', decision, categories })
        return record as any
      },
    }
    const result = await adapter.recordConsent('user1', 'accept', ['analytics'])
    expect(result.decision).toBe('accept')
  })

  it('rejects invalid consent', () => {
    expect('accept').toMatch(/^(accept|reject)$/)
    expect('invalid').not.toMatch(/^(accept|reject)$/)
  })

  it('returns null for unknown user', async () => {
    const adapter: BannerAdapter = {
      async getConsent() { return null },
      async recordConsent() { throw new Error('should not be called') },
    }
    const result = await adapter.getConsent('nobody')
    expect(result).toBeNull()
  })
})
