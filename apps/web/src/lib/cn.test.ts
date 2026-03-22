import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('class-a', 'class-b')
    expect(result).toBe('class-a class-b')
  })

  it('handles undefined and null inputs', () => {
    const result = cn('class-a', undefined, null, 'class-b')
    expect(result).toBe('class-a class-b')
  })

  it('handles empty string inputs', () => {
    const result = cn('', 'class-a', '')
    expect(result).toBe('class-a')
  })

  it('handles mixed inputs (strings, objects, arrays)', () => {
    const result = cn('class-a', { 'class-b': true, 'class-c': false }, ['class-d'])
    expect(result).toBe('class-a class-b class-d')
  })

  it('returns empty string for no inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })
})
