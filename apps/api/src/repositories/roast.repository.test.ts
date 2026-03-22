import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput, UpdateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from './in-memory/roast-in-memory.repository.js'

describe('InMemoryRoastRepository', () => {
  let repository: InMemoryRoastRepository

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
  })

  describe('create', () => {
    it('should create a roast', async () => {
      const input: CreateRoastInput = {
        code: 'const x = 1;',
        language: 'javascript',
      }

      const roast = await repository.create(input)

      expect(roast.id).toBeDefined()
      expect(roast.code).toBe('const x = 1;')
      expect(roast.language).toBe('javascript')
      expect(roast.score).toBe(0)
      expect(roast.verdict).toBe('warning')
    })

    it('should set userId to null when not provided', async () => {
      const input: CreateRoastInput = {
        code: 'const x = 1;',
        language: 'javascript',
      }

      const roast = await repository.create(input)

      expect(roast.userId).toBeNull()
    })

    it('should set userId when provided', async () => {
      const input: CreateRoastInput = {
        code: 'const x = 1;',
        language: 'javascript',
        userId: 'user-123',
      }

      const roast = await repository.create(input)

      expect(roast.userId).toBe('user-123')
    })
  })

  describe('findById', () => {
    it('should find a roast by id', async () => {
      const input: CreateRoastInput = {
        code: 'const x = 1;',
        language: 'javascript',
      }

      const created = await repository.create(input)
      const found = await repository.findById(created.id)

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
    })

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent')

      expect(found).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all roasts', async () => {
      await repository.create({ code: 'first', language: 'javascript' })
      await repository.create({ code: 'second', language: 'typescript' })
      await repository.create({ code: 'third', language: 'python' })

      const roasts = await repository.findAll()

      expect(roasts).toHaveLength(3)
      expect(roasts.map(r => r.code)).toContain('first')
      expect(roasts.map(r => r.code)).toContain('second')
      expect(roasts.map(r => r.code)).toContain('third')
    })

    it('should return limited results when limit is provided', async () => {
      await repository.create({ code: 'first', language: 'javascript' })
      await repository.create({ code: 'second', language: 'typescript' })
      await repository.create({ code: 'third', language: 'python' })

      const roasts = await repository.findAll(2)

      expect(roasts).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update a roast', async () => {
      const created = await repository.create({
        code: 'const x = 1;',
        language: 'javascript',
      })

      const update: UpdateRoastInput = {
        score: 8.5,
        verdict: 'good',
        roastQuote: 'Not bad!',
      }

      const updated = await repository.update(created.id, update)

      expect(updated).toBeDefined()
      expect(updated?.score).toBe(8.5)
      expect(updated?.verdict).toBe('good')
      expect(updated?.roastQuote).toBe('Not bad!')
    })

    it('should return null for non-existent roast', async () => {
      const updated = await repository.update('non-existent', { score: 5 })

      expect(updated).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a roast', async () => {
      const created = await repository.create({
        code: 'const x = 1;',
        language: 'javascript',
      })

      const deleted = await repository.delete(created.id)

      expect(deleted).toBe(true)

      const found = await repository.findById(created.id)
      expect(found).toBeNull()
    })

    it('should return false for non-existent roast', async () => {
      const deleted = await repository.delete('non-existent')

      expect(deleted).toBe(false)
    })
  })
})
