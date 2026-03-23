import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { ListRoastsUseCase } from './list-roasts.use-case.js'

describe('ListRoastsUseCase', () => {
  let repository: InMemoryRoastRepository
  let useCase: ListRoastsUseCase

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
    useCase = new ListRoastsUseCase(repository)
  })

  it('should return empty list when no roasts exist', async () => {
    const result = await useCase.execute()

    expect(result).toHaveLength(0)
  })

  it('should return all roasts when no limit is provided', async () => {
    await repository.create({ code: 'first', language: 'javascript' })
    await repository.create({ code: 'second', language: 'typescript' })
    await repository.create({ code: 'third', language: 'python' })

    const result = await useCase.execute()

    expect(result).toHaveLength(3)
  })

  it('should return limited results when limit is provided', async () => {
    await repository.create({ code: 'first', language: 'javascript' })
    await repository.create({ code: 'second', language: 'typescript' })
    await repository.create({ code: 'third', language: 'python' })

    const result = await useCase.execute(2)

    expect(result).toHaveLength(2)
  })

  it('should return roasts ordered by createdAt descending', async () => {
    const roast1 = await repository.create({ code: 'first', language: 'javascript' })
    await new Promise(resolve => setTimeout(resolve, 10))
    const roast2 = await repository.create({ code: 'second', language: 'typescript' })

    const result = await useCase.execute()

    expect(result[0].id).toBe(roast2.id)
    expect(result[1].id).toBe(roast1.id)
  })

  it('should return roast with all properties', async () => {
    await repository.create({
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'roast',
    })

    const result = await useCase.execute()

    expect(result[0]).toMatchObject({
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'roast',
    })
  })

  it('should return roast with calculated lineCount', async () => {
    await repository.create({
      code: 'line 1\nline 2\nline 3',
      language: 'javascript',
    })

    const result = await useCase.execute()

    expect(result[0].lineCount).toBe(3)
  })

  it('should return roast with default score of 0', async () => {
    await repository.create({
      code: 'const x = 1;',
      language: 'javascript',
    })

    const result = await useCase.execute()

    expect(result[0].score).toBe(0)
  })

  it('should return roast with default verdict of warning', async () => {
    await repository.create({
      code: 'const x = 1;',
      language: 'javascript',
    })

    const result = await useCase.execute()

    expect(result[0].verdict).toBe('warning')
  })
})
