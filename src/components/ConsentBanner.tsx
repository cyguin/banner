import React, { useEffect, useState } from 'react'
import type { ConsentDecision, ConsentRecordData, BannerAdapter } from '../types'

export type { ConsentDecision, ConsentRecordData, BannerAdapter }

export interface ConsentBannerProps {
  apiBase?: string
  userId?: string
  theme?: 'light' | 'dark'
  className?: string
  onAccept?: () => void
  onReject?: () => void
}

export function ConsentBanner({
  apiBase = '/api/banner',
  userId,
  theme = 'light',
  className = '',
  onAccept,
  onReject,
}: ConsentBannerProps) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const url = new URL(`${apiBase}/[...cyguin]`)
        url.searchParams.set('cyguin', '')
        if (userId) url.searchParams.set('userId', userId)
        const res = await fetch(`${apiBase}/[...cyguin]${url.search}`)
        if (res.ok) {
          const data: ConsentRecordData | null = await res.json()
          if (data) {
            setLoading(false)
            return
          }
        }
      } catch {
        // proceed to show banner
      }
      setVisible(true)
      setLoading(false)
    }
    checkConsent()
  }, [apiBase, userId])

  const handleDecision = async (decision: ConsentDecision) => {
    try {
      await fetch(`${apiBase}/[...cyguin]`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, decision, categories: [] }),
      })
    } catch {
      // best-effort
    }
    setVisible(false)
    if (decision === 'accept') {
      onAccept?.()
    } else {
      onReject?.()
    }
  }

  if (loading || !visible) return null

  return (
    <div
      className={`cyguin-banner ${className}`}
      data-theme={theme}
      role="region"
      aria-label="Cookie consent"
    >
      <style>{`
        .cyguin-banner {
          --cyguin-bg: #ffffff;
          --cyguin-bg-subtle: #f1f3f6;
          --cyguin-border: #e5e5e5;
          --cyguin-border-focus: #ffd21f;
          --cyguin-fg: #0a0d17;
          --cyguin-fg-muted: #858b98;
          --cyguin-accent: #ffd21f;
          --cyguin-accent-dark: #e0a900;
          --cyguin-accent-fg: #0a0d17;
          --cyguin-radius: 6px;
          --cyguin-shadow: 0 1px 4px rgba(0,0,0,0.08);
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 99999;
          background: var(--cyguin-bg);
          border-top: 1px solid var(--cyguin-border);
          box-shadow: var(--cyguin-shadow);
          padding: 16px 24px;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cyguin-banner[data-theme="dark"] {
          --cyguin-bg: #0a0d17;
          --cyguin-bg-subtle: #101521;
          --cyguin-border: #252b3a;
          --cyguin-border-focus: #ffd21f;
          --cyguin-fg: #f1f3f6;
          --cyguin-fg-muted: #858b98;
          --cyguin-accent: #ffd21f;
          --cyguin-accent-dark: #e0a900;
          --cyguin-accent-fg: #0a0d17;
          --cyguin-radius: 6px;
          --cyguin-shadow: 0 1px 4px rgba(0,0,0,0.32);
        }
        .cyguin-banner__text {
          color: var(--cyguin-fg);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          flex: 1;
          min-width: 200px;
        }
        .cyguin-banner__text a {
          color: var(--cyguin-accent);
          text-decoration: underline;
        }
        .cyguin-banner__actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .cyguin-banner__btn {
          padding: 8px 16px;
          border-radius: var(--cyguin-radius);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.15s, border-color 0.15s;
        }
        .cyguin-banner__btn--accept {
          background: var(--cyguin-accent);
          color: var(--cyguin-accent-fg);
          border-color: var(--cyguin-accent);
        }
        .cyguin-banner__btn--accept:hover {
          background: var(--cyguin-accent-dark);
          border-color: var(--cyguin-accent-dark);
        }
        .cyguin-banner__btn--reject {
          background: transparent;
          color: var(--cyguin-fg-muted);
          border-color: var(--cyguin-border);
        }
        .cyguin-banner__btn--reject:hover {
          border-color: var(--cyguin-fg-muted);
          color: var(--cyguin-fg);
        }
      `}</style>
      <p className="cyguin-banner__text">
        We use cookies to improve your experience. By continuing to browse you agree to our cookie policy.
      </p>
      <div className="cyguin-banner__actions">
        <button
          className="cyguin-banner__btn cyguin-banner__btn--reject"
          onClick={() => handleDecision('reject')}
          type="button"
        >
          Reject
        </button>
        <button
          className="cyguin-banner__btn cyguin-banner__btn--accept"
          onClick={() => handleDecision('accept')}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default ConsentBanner
