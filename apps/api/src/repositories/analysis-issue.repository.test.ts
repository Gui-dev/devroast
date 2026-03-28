import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnalysisIssueRepository } from './in-memory/roast-in-memory.repository.js'

describe('InMemoryAnalysisIssueRepository', () => {
  let repository: InMemoryAnalysisIssueRepository

  beforeEach(() => {
    repository = new InMemoryAnalysisIssueRepository()
  })

  describe('create', () => {
    it('should create an analysis issue', async () => {
      const issue = await repository.create('roast-1', {
        title: 'Unused variable',
        description: 'Variable x is declared but never used',
        severity: 'warning',
        issueType: 'unused-variable',
        lineNumber: 10,
      })

      expect(issue.id).toBeDefined()
      expect(issue.roastId).toBe('roast-1')
      expect(issue.title).toBe('Unused variable')
      expect(issue.description).toBe('Variable x is declared but never used')
      expect(issue.severity).toBe('warning')
      expect(issue.issueType).toBe('unused-variable')
      expect(issue.lineNumber).toBe(10)
      expect(issue.createdAt).toBeInstanceOf(Date)
    })

    it('should set lineNumber to null when not provided', async () => {
      const issue = await repository.create('roast-1', {
        title: 'Issue',
        description: 'Desc',
        severity: 'error',
        issueType: 'type',
      })

      expect(issue.lineNumber).toBeNull()
    })
  })

  describe('findByRoastId', () => {
    it('should return empty array when no issues exist', async () => {
      const result = await repository.findByRoastId('roast-1')

      expect(result).toEqual([])
    })

    it('should return issues for a specific roast', async () => {
      await repository.create('roast-1', {
        title: 'Issue 1',
        description: 'Desc 1',
        severity: 'warning',
        issueType: 'type-1',
      })
      await repository.create('roast-1', {
        title: 'Issue 2',
        description: 'Desc 2',
        severity: 'error',
        issueType: 'type-2',
      })
      await repository.create('roast-2', {
        title: 'Issue 3',
        description: 'Desc 3',
        severity: 'info',
        issueType: 'type-3',
      })

      const result = await repository.findByRoastId('roast-1')

      expect(result).toHaveLength(2)
      expect(result.every(i => i.roastId === 'roast-1')).toBe(true)
    })

    it('should return empty array for non-existent roast', async () => {
      await repository.create('roast-1', {
        title: 'Issue',
        description: 'Desc',
        severity: 'warning',
        issueType: 'type',
      })

      const result = await repository.findByRoastId('non-existent')

      expect(result).toEqual([])
    })
  })
})
