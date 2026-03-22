import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { GetRoastUseCase } from './get-roast.use-case.js'

describe('GetRoastUseCase', () => {
  let repository: InMemoryRoastRepository
  let useCase: GetRoastUseCase
  let createdRoastId: string

  beforeEach(async () => {
    repository = new InMemoryRoastRepository()
    useCase = new GetRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await repository.create(input)
    createdRoastId = roast.id
  })

  it('should find a roast by id', async () => {
    const roast = await useCase.execute(createdRoastId)

    expect(roast).toBeDefined()
    expect(roast?.id).toBe(createdRoastId)
    expect(roast?.code).toBe('const x = 1;')
  })

  it('should return null for non-existent id', async () => {
    const roast = await useCase.execute('non-existent-id')

    expect(roast).toBeNull()
  })
})
