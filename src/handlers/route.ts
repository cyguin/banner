import type { BannerAdapter, ConsentDecision } from '../types'

export interface BannerHandlerOptions {
  adapter: BannerAdapter
}

export function createBannerHandler(options: BannerHandlerOptions) {
  const { adapter } = options

  return async function handler(
    request: Request,
    _params: unknown
  ): Promise<Response> {
    const method = request.method

    if (method === 'GET') {
      let searchParams: URLSearchParams
      try {
        searchParams = new URL(request.url).searchParams
      } catch {
        return Response.json({ error: 'Invalid request URL' }, { status: 400 })
      }
      const userId = searchParams.get('userId') ?? undefined
      const record = await adapter.getConsent(userId)
      if (!record) {
        return Response.json(null, { status: 200 })
      }
      return Response.json(record, { status: 200 })
    }

    if (method === 'POST') {
      let body: { userId?: string; decision: ConsentDecision; categories?: string[] }
      try {
        body = await request.json()
      } catch {
        return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
      const { userId, decision, categories } = body

      if (!decision || !['accept', 'reject'].includes(decision)) {
        return Response.json(
          { error: 'Invalid decision. Must be "accept" or "reject".' },
          { status: 400 }
        )
      }

      const record = await adapter.recordConsent(
        userId,
        decision,
        categories ?? []
      )
      return Response.json(record, { status: 201 })
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }
}
