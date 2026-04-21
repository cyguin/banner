# @cyguin/banner

Cookie consent and GDPR notice drop-in for Next.js. Stores consent decisions in DB for audit trail, renders a dismissible consent banner.

## Install

```bash
npm install @cyguin/banner
```

## Configure Adapter

### SQLite

```ts
// lib/banner.ts
import { SQLiteAdapter } from '@cyguin/banner/adapters/sqlite'

export const bannerAdapter = SQLiteAdapter({ path: './data/banner.db' })
```

### Postgres

```ts
// lib/banner.ts
import { PostgresAdapter } from '@cyguin/banner/adapters/postgres'

export const bannerAdapter = PostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
})
```

## Add API Route

```ts
// app/api/banner/[...cyguin]/route.ts
import { createBannerHandler } from '@cyguin/banner/next'
import { bannerAdapter } from '@/lib/banner'

export const GET = createBannerHandler({ adapter: bannerAdapter })
export const POST = createBannerHandler({ adapter: bannerAdapter })
```

## Drop In Component

```tsx
// app/layout.tsx (or any page)
import { ConsentBanner } from '@cyguin/banner/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <ConsentBanner
          apiBase="/api/banner"
          userId="user_123"       // optional
          theme="dark"             // or "light"
          onAccept={() => console.log('accepted')}
          onReject={() => console.log('rejected')}
        />
      </body>
    </html>
  )
}
```

## Theming

The banner uses `--cyguin-*` CSS custom properties. Default is dark.

```tsx
// Light theme
<ConsentBanner theme="light" />
```

Customise via CSS:

```css
.cyguin-banner {
  --cyguin-accent: #ff6600;
  --cyguin-radius: 0;
}
```

## Exports

| Import | What |
|--------|------|
| `@cyguin/banner` | Types: `ConsentRecordData`, `ConsentDecision`, `BannerAdapter` |
| `@cyguin/banner/next` | `createBannerHandler` |
| `@cyguin/banner/react` | `ConsentBanner` |
| `@cyguin/banner/adapters/sqlite` | `SQLiteAdapter` |
| `@cyguin/banner/adapters/postgres` | `PostgresAdapter` |

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/banner/[...cyguin]` | Get current consent record for user |
| POST | `/api/banner/[...cyguin]` | Record consent decision |

## DB Schema

```sql
CREATE TABLE consent_records (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  decision TEXT NOT NULL,
  categories TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL
);
```
