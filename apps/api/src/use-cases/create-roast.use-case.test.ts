import { describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { CreateRoastUseCase } from './create-roast.use-case.js'

describe('CreateRoastUseCase', () => {
  it('should create a roast with valid data', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.id).toBeDefined()
    expect(roast.code).toBe('const x = 1;')
    expect(roast.language).toBe('javascript')
    expect(roast.lineCount).toBe(1)
    expect(roast.roastMode).toBe('roast')
  })

  it('should trim code before saving', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: '  const x = 1;  ',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.code).toBe('const x = 1;')
  })

  it('should throw error when code is empty', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: '',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should throw error when code is only whitespace', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: '   ',
      language: 'javascript',
    }

    await expect(useCase.execute(input)).rejects.toThrow('Code is required')
  })

  it('should use default roast mode when not provided', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.roastMode).toBe('roast')
  })

  it('should use provided roast mode when specified', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
      roastMode: 'honest',
    }

    const roast = await useCase.execute(input)

    expect(roast.roastMode).toBe('honest')
  })

  it('should calculate line count correctly', async () => {
    const repository = new InMemoryRoastRepository()
    const useCase = new CreateRoastUseCase(repository)

    const input: CreateRoastInput = {
      code: 'const a = 1;\nconst b = 2;\nconst c = 3;',
      language: 'javascript',
    }

    const roast = await useCase.execute(input)

    expect(roast.lineCount).toBe(3)
  })
})
