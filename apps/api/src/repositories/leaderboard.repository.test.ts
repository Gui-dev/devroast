import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLeaderboardRepository } from './in-memory/roast-in-memory.repository.js'

describe('InMemoryLeaderboardRepository', () => {
  let repository: InMemoryLeaderboardRepository

  beforeEach(() => {
    repository = new InMemoryLeaderboardRepository()
  })

  describe('create', () => {
    it('should create a leaderboard entry', async () => {
      const entry = await repository.create({
        roastId: 'roast-1',
        rank: 1,
        score: 3,
        language: 'javascript',
        codePreview: 'const x = 1;',
        code: 'const x = 1;',
        lineCount: 1,
      })

      expect(entry.id).toBeDefined()
      expect(entry.roastId).toBe('roast-1')
      expect(entry.rank).toBe(1)
      expect(entry.score).toBe(3)
      expect(entry.language).toBe('javascript')
      expect(entry.codePreview).toBe('const x = 1;')
    })
  })

  describe('getTopRoasts', () => {
    it('should return empty array when no entries exist', async () => {
      const result = await repository.getTopRoasts()

      expect(result).toEqual([])
    })

    it('should return entries ordered by rank ascending', async () => {
      await repository.create({
        roastId: '1',
        rank: 3,
        score: 5,
        language: 'javascript',
        codePreview: 'code1',
        code: 'code1',
        lineCount: 1,
      })
      await repository.create({
        roastId: '2',
        rank: 1,
        score: 2,
        language: 'typescript',
        codePreview: 'code2',
        code: 'code2',
        lineCount: 1,
      })
      await repository.create({
        roastId: '3',
        rank: 2,
        score: 8,
        language: 'python',
        codePreview: 'code3',
        code: 'code3',
        lineCount: 1,
      })

      const result = await repository.getTopRoasts()

      expect(result).toHaveLength(3)
      expect(result[0].rank).toBe(1)
      expect(result[1].rank).toBe(2)
      expect(result[2].rank).toBe(3)
    })

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        await repository.create({
          roastId: `roast-${i}`,
          rank: i + 1,
          score: i,
          language: 'javascript',
          codePreview: `code${i}`,
          code: `code${i}`,
          lineCount: 1,
        })
      }

      const result = await repository.getTopRoasts(3)

      expect(result).toHaveLength(3)
    })
  })

  describe('getRankByRoastId', () => {
    it('should return entry by roastId', async () => {
      await repository.create({
        roastId: 'roast-1',
        rank: 1,
        score: 3,
        language: 'javascript',
        codePreview: 'code',
        code: 'code',
        lineCount: 1,
      })

      const result = await repository.getRankByRoastId('roast-1')

      expect(result).toBeDefined()
      expect(result?.roastId).toBe('roast-1')
    })

    it('should return null for non-existent roastId', async () => {
      const result = await repository.getRankByRoastId('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getWorstRoasts', () => {
    it('should return empty array when no entries exist', async () => {
      const result = await repository.getWorstRoasts()

      expect(result).toEqual([])
    })

    it('should return entries ordered by score ascending', async () => {
      await repository.create({
        roastId: '1',
        rank: 1,
        score: 8,
        language: 'javascript',
        codePreview: 'code1',
        code: 'code1',
        lineCount: 1,
      })
      await repository.create({
        roastId: '2',
        rank: 2,
        score: 2,
        language: 'typescript',
        codePreview: 'code2',
        code: 'code2',
        lineCount: 1,
      })
      await repository.create({
        roastId: '3',
        rank: 3,
        score: 5,
        language: 'python',
        codePreview: 'code3',
        code: 'code3',
        lineCount: 1,
      })

      const result = await repository.getWorstRoasts()

      expect(result).toHaveLength(3)
      expect(result[0].score).toBe(2)
      expect(result[1].score).toBe(5)
      expect(result[2].score).toBe(8)
    })

    it('should default to limit of 3', async () => {
      for (let i = 0; i < 10; i++) {
        await repository.create({
          roastId: `roast-${i}`,
          rank: i + 1,
          score: i,
          language: 'javascript',
          codePreview: `code${i}`,
          code: `code${i}`,
          lineCount: 1,
        })
      }

      const result = await repository.getWorstRoasts()

      expect(result).toHaveLength(3)
    })

    it('should respect custom limit', async () => {
      for (let i = 0; i < 10; i++) {
        await repository.create({
          roastId: `roast-${i}`,
          rank: i + 1,
          score: i,
          language: 'javascript',
          codePreview: `code${i}`,
          code: `code${i}`,
          lineCount: 1,
        })
      }

      const result = await repository.getWorstRoasts(5)

      expect(result).toHaveLength(5)
      expect(result[0].score).toBe(0)
      expect(result[4].score).toBe(4)
    })
  })
})
