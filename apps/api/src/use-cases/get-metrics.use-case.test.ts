import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { GetMetricsUseCase } from './get-metrics.use-case.js'

describe('GetMetricsUseCase', () => {
  let repository: InMemoryRoastRepository
  let useCase: GetMetricsUseCase

  beforeEach(() => {
    repository = new InMemoryRoastRepository()
    useCase = new GetMetricsUseCase(repository)
  })

  it('should return zero metrics when no roasts exist', async () => {
    const result = await useCase.execute()

    expect(result.totalRoasts).toBe(0)
    expect(result.avgScore).toBe(0)
  })

  it('should return correct totalRoasts count', async () => {
    await repository.create({ code: 'first', language: 'javascript' })
    await repository.create({ code: 'second', language: 'typescript' })
    await repository.create({ code: 'third', language: 'python' })

    const result = await useCase.execute()

    expect(result.totalRoasts).toBe(3)
  })

  it('should return correct avgScore with single roast', async () => {
    const roast = await repository.create({ code: 'test', language: 'javascript' })
    await repository.update(roast.id, { score: 7.5 })

    const result = await useCase.execute()

    expect(result.avgScore).toBe(7.5)
  })

  it('should return correct avgScore with multiple roasts', async () => {
    const roast1 = await repository.create({ code: 'first', language: 'javascript' })
    const roast2 = await repository.create({ code: 'second', language: 'javascript' })
    const roast3 = await repository.create({ code: 'third', language: 'javascript' })

    await repository.update(roast1.id, { score: 2 })
    await repository.update(roast2.id, { score: 6 })
    await repository.update(roast3.id, { score: 10 })

    const result = await useCase.execute()

    expect(result.totalRoasts).toBe(3)
    expect(result.avgScore).toBe(6)
  })

  it('should round avgScore to one decimal place', async () => {
    const roast1 = await repository.create({ code: 'first', language: 'javascript' })
    const roast2 = await repository.create({ code: 'second', language: 'javascript' })

    await repository.update(roast1.id, { score: 2.333 })
    await repository.update(roast2.id, { score: 7.777 })

    const result = await useCase.execute()

    expect(result.avgScore).toBe(5.1)
  })

  it('should return 0 avgScore when all roasts have score 0', async () => {
    await repository.create({ code: 'first', language: 'javascript' })
    await repository.create({ code: 'second', language: 'javascript' })

    const result = await useCase.execute()

    expect(result.totalRoasts).toBe(2)
    expect(result.avgScore).toBe(0)
  })

  it('should handle mixed scores including zeros', async () => {
    const roast1 = await repository.create({ code: 'first', language: 'javascript' })
    const roast2 = await repository.create({ code: 'second', language: 'javascript' })

    await repository.update(roast1.id, { score: 8 })
    // roast2 keeps default score of 0

    const result = await useCase.execute()

    expect(result.avgScore).toBe(4)
  })

  it('should return avgScore of 10 when all roasts have max score', async () => {
    const roast1 = await repository.create({ code: 'first', language: 'javascript' })
    const roast2 = await repository.create({ code: 'second', language: 'javascript' })

    await repository.update(roast1.id, { score: 10 })
    await repository.update(roast2.id, { score: 10 })

    const result = await useCase.execute()

    expect(result.avgScore).toBe(10)
  })
})
