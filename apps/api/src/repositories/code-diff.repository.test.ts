import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCodeDiffRepository } from './in-memory/roast-in-memory.repository.js'

describe('InMemoryCodeDiffRepository', () => {
  let repository: InMemoryCodeDiffRepository

  beforeEach(() => {
    repository = new InMemoryCodeDiffRepository()
  })

  describe('create', () => {
    it('should create a code diff', async () => {
      const diff = await repository.create('roast-1', {
        removedLine: 'const x = 1;',
        addedLine: 'let x = 1;',
        context: 'variable declaration',
        lineNumber: 5,
      })

      expect(diff.id).toBeDefined()
      expect(diff.roastId).toBe('roast-1')
      expect(diff.removedLine).toBe('const x = 1;')
      expect(diff.addedLine).toBe('let x = 1;')
      expect(diff.context).toBe('variable declaration')
      expect(diff.lineNumber).toBe(5)
      expect(diff.createdAt).toBeInstanceOf(Date)
    })

    it('should set optional fields to null when not provided', async () => {
      const diff = await repository.create('roast-1', {})

      expect(diff.removedLine).toBeNull()
      expect(diff.addedLine).toBeNull()
      expect(diff.context).toBeNull()
      expect(diff.lineNumber).toBeNull()
    })
  })

  describe('findByRoastId', () => {
    it('should return empty array when no diffs exist', async () => {
      const result = await repository.findByRoastId('roast-1')

      expect(result).toEqual([])
    })

    it('should return diffs for a specific roast', async () => {
      await repository.create('roast-1', { removedLine: 'a', lineNumber: 1 })
      await repository.create('roast-1', { removedLine: 'b', lineNumber: 2 })
      await repository.create('roast-2', { removedLine: 'c', lineNumber: 1 })

      const result = await repository.findByRoastId('roast-1')

      expect(result).toHaveLength(2)
      expect(result.every(d => d.roastId === 'roast-1')).toBe(true)
    })

    it('should return empty array for non-existent roast', async () => {
      await repository.create('roast-1', { removedLine: 'a', lineNumber: 1 })

      const result = await repository.findByRoastId('non-existent')

      expect(result).toEqual([])
    })
  })
})
