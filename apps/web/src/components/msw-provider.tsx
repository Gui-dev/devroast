'use client'

import { useEffect, useState } from 'react'

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    async function enableMsw() {
      if (process.env.NEXT_PUBLIC_MODE === 'test') {
        const { enableMSW } = await import('../../test/mocks/browser')
        await enableMSW()
        setEnabled(true)
      }
    }
    enableMsw()
  }, [])

  if (!enabled && process.env.NEXT_PUBLIC_MODE === 'test') {
    return null
  }

  return <>{children}</>
}
