import { describe, expect, it } from 'vitest'
import { getVerdictColor } from './get-verdict-color'

describe('getVerdictColor', () => {
  it('returns red (#EF4444) for needs_serious_help', () => {
    expect(getVerdictColor('needs_serious_help')).toBe('#EF4444')
  })

  it('returns red (#EF4444) for critical', () => {
    expect(getVerdictColor('critical')).toBe('#EF4444')
  })

  it('returns amber (#F59E0B) for warning', () => {
    expect(getVerdictColor('warning')).toBe('#F59E0B')
  })

  it('returns green (#10B981) for good', () => {
    expect(getVerdictColor('good')).toBe('#10B981')
  })
})
