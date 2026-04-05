export type ConsentDecision = 'accept' | 'reject'

export interface ConsentRecordData {
  id: string
  userId: string | null
  decision: ConsentDecision
  categories: string[]
  createdAt: number
}

export interface BannerAdapter {
  getConsent(userId?: string): Promise<ConsentRecordData | null>
  recordConsent(
    userId: string | undefined,
    decision: ConsentDecision,
    categories: string[]
  ): Promise<ConsentRecordData>
}
