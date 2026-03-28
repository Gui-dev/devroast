import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLeaderboardRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { GetWorstRoastsUseCase } from './get-worst-roasts.use-case.js'

describe('GetWorstRoastsUseCase', () => {
  let repository: InMemoryLeaderboardRepository
  let useCase: GetWorstRoastsUseCase

  beforeEach(() => {
    repository = new InMemoryLeaderboardRepository()
    useCase = new GetWorstRoastsUseCase(repository)
  })

  it('should return empty array when no entries exist', async () => {
    const result = await useCase.execute()

    expect(result).toEqual([])
  })

  it('should return worst 3 roasts ordered by score ascending', async () => {
    await repository.create({
      roastId: '1',
      rank: 1,
      score: 5,
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
      score: 8,
      language: 'python',
      codePreview: 'code3',
      code: 'code3',
      lineCount: 1,
    })
    await repository.create({
      roastId: '4',
      rank: 4,
      score: 1,
      language: 'go',
      codePreview: 'code4',
      code: 'code4',
      lineCount: 1,
    })

    const result = await useCase.execute()

    expect(result).toHaveLength(3)
    expect(result[0].score).toBe(1)
    expect(result[1].score).toBe(2)
    expect(result[2].score).toBe(5)
  })

  it('should return all entries when fewer than 3 exist', async () => {
    await repository.create({
      roastId: '1',
      rank: 1,
      score: 3,
      language: 'javascript',
      codePreview: 'code1',
      code: 'code1',
      lineCount: 1,
    })
    await repository.create({
      roastId: '2',
      rank: 2,
      score: 7,
      language: 'python',
      codePreview: 'code2',
      code: 'code2',
      lineCount: 1,
    })

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
  })

  it('should return exactly 3 when more entries exist', async () => {
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

    const result = await useCase.execute()

    expect(result).toHaveLength(3)
  })
})
