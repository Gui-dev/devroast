import { describe, expect, it } from 'vitest'
import { getOgScoreColor } from './get-og-score-color'

describe('getOgScoreColor', () => {
  it('returns green (#10B981) for score >= 7', () => {
    expect(getOgScoreColor(7)).toBe('#10B981')
    expect(getOgScoreColor(8)).toBe('#10B981')
    expect(getOgScoreColor(10)).toBe('#10B981')
  })

  it('returns amber (#F59E0B) for score >= 4 and < 7', () => {
    expect(getOgScoreColor(4)).toBe('#F59E0B')
    expect(getOgScoreColor(5)).toBe('#F59E0B')
    expect(getOgScoreColor(6.9)).toBe('#F59E0B')
  })

  it('returns red (#EF4444) for score < 4', () => {
    expect(getOgScoreColor(0)).toBe('#EF4444')
    expect(getOgScoreColor(1)).toBe('#EF4444')
    expect(getOgScoreColor(3.9)).toBe('#EF4444')
  })
})
