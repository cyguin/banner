export type {
  ConsentDecision,
  ConsentRecordData,
  BannerAdapter,
} from './types'

export { ConsentBanner } from './components/ConsentBanner'
export type { ConsentBannerProps } from './components/ConsentBanner'

export { SQLiteAdapter } from './adapters/sqlite'
export type { SQLiteAdapterOptions } from './adapters/sqlite'

export { PostgresAdapter } from './adapters/postgres'
export type { PostgresAdapterOptions } from './adapters/postgres'

export { createBannerHandler } from './handlers/route'
export type { BannerHandlerOptions } from './handlers/route'
