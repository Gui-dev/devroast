import { describe, expect, it } from 'vitest'
import { generateMetadata } from './page'

describe('generateMetadata', () => {
  it('includes OG image URL in openGraph.images', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'abc123' }),
    })

    expect(metadata.openGraph).toHaveProperty('images')
    expect(metadata.openGraph?.images).toContain('/roast/abc123/og')
  })

  it('includes title with roast ID', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ id: 'test-id-123' }),
    })

    expect(metadata.title).toContain('test-id-')
  })
})
