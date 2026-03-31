import { describe, expect, it } from 'vitest'
import { OgImage } from './og-image'

describe('OgImage', () => {
  const defaultProps = {
    score: 3.5,
    verdict: 'needs_serious_help',
    language: 'javascript',
    lineCount: 7,
    roastQuote: 'this code was written during a power outage',
  }

  it('renders score correctly', () => {
    const component = OgImage(defaultProps)
    expect(component).toBeDefined()
    expect(component.type).toBe('div')
  })

  it('displays the score value', () => {
    const component = OgImage({ ...defaultProps, score: 3.5 })
    expect(component).toBeDefined()
  })

  it('displays the verdict text', () => {
    const component = OgImage({ ...defaultProps, verdict: 'needs_serious_help' })
    expect(component).toBeDefined()
  })

  it('displays language and line count', () => {
    const component = OgImage({
      ...defaultProps,
      language: 'typescript',
      lineCount: 42,
    })
    expect(component).toBeDefined()
  })

  it('displays roast quote', () => {
    const component = OgImage({
      ...defaultProps,
      roastQuote: 'this is a test quote',
    })
    expect(component).toBeDefined()
  })

  it('handles null roastQuote gracefully', () => {
    const component = OgImage({
      ...defaultProps,
      roastQuote: null,
    })
    expect(component).toBeDefined()
  })
})
