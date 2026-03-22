import { describe, expect, it } from 'vitest'
import { getScoreColor } from './get-score-color'

describe('getScoreColor', () => {
  it('returns green (#10B981) for progress >= 0.7', () => {
    expect(getScoreColor(7, 10)).toBe('#10B981')
    expect(getScoreColor(10, 10)).toBe('#10B981')
    expect(getScoreColor(8.5, 10)).toBe('#10B981')
  })

  it('returns amber (#F59E0B) for progress >= 0.4 and < 0.7', () => {
    expect(getScoreColor(4, 10)).toBe('#F59E0B')
    expect(getScoreColor(5, 10)).toBe('#F59E0B')
    expect(getScoreColor(6.9, 10)).toBe('#F59E0B')
  })

  it('returns red (#EF4444) for progress < 0.4', () => {
    expect(getScoreColor(0, 10)).toBe('#EF4444')
    expect(getScoreColor(1, 10)).toBe('#EF4444')
    expect(getScoreColor(3.9, 10)).toBe('#EF4444')
  })

  it('clamps progress between 0 and 1', () => {
    expect(getScoreColor(-5, 10)).toBe('#EF4444')
    expect(getScoreColor(15, 10)).toBe('#10B981')
    expect(getScoreColor(100, 10)).toBe('#10B981')
  })
})
