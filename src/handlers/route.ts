import { NextRequest, NextResponse } from 'next/server'
import type { BannerAdapter, ConsentDecision } from '../types'

export interface BannerHandlerOptions {
  adapter: BannerAdapter
}

export function createBannerHandler(options: BannerHandlerOptions) {
  const { adapter } = options

  return async function handler(
    request: NextRequest,
    { params }: { params: { cyguin: string[] } }
  ): Promise<NextResponse> {
    const method = request.method

    if (method === 'GET') {
      const userId = request.nextUrl.searchParams.get('userId') ?? undefined
      const record = await adapter.getConsent(userId)
      if (!record) {
        return NextResponse.json(null, { status: 200 })
      }
      return NextResponse.json(record, { status: 200 })
    }

    if (method === 'POST') {
      const body = await request.json()
      const { userId, decision, categories } = body as {
        userId?: string
        decision: ConsentDecision
        categories?: string[]
      }

      if (!decision || !['accept', 'reject'].includes(decision)) {
        return NextResponse.json(
          { error: 'Invalid decision. Must be "accept" or "reject".' },
          { status: 400 }
        )
      }

      const record = await adapter.recordConsent(
        userId,
        decision,
        categories ?? []
      )
      return NextResponse.json(record, { status: 201 })
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}
