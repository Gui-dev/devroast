import { beforeEach, describe, expect, it } from 'vitest'
import type { CreateRoastInput } from '../entities/roast.entity.js'
import { InMemoryAnalysisIssueRepository } from '../repositories/in-memory/analysis-issue-in-memory.repository.js'
import { InMemoryCodeDiffRepository } from '../repositories/in-memory/code-diff-in-memory.repository.js'
import { InMemoryRoastRepository } from '../repositories/in-memory/roast-in-memory.repository.js'
import { GetRoastFullUseCase } from './get-roast-full.use-case.js'

describe('GetRoastFullUseCase', () => {
  let roastRepository: InMemoryRoastRepository
  let issueRepository: InMemoryAnalysisIssueRepository
  let codeDiffRepository: InMemoryCodeDiffRepository
  let useCase: GetRoastFullUseCase
  let createdRoastId: string

  beforeEach(async () => {
    roastRepository = new InMemoryRoastRepository()
    issueRepository = new InMemoryAnalysisIssueRepository()
    codeDiffRepository = new InMemoryCodeDiffRepository()
    useCase = new GetRoastFullUseCase(roastRepository, issueRepository, codeDiffRepository)

    const input: CreateRoastInput = {
      code: 'const x = 1;',
      language: 'javascript',
    }

    const roast = await roastRepository.create(input)
    createdRoastId = roast.id
  })

  it('returns null when roast not found', async () => {
    const result = await useCase.execute('non-existent-id')

    expect(result).toBeNull()
  })

  it('returns roast with issues and diffs when found', async () => {
    const issue = await issueRepository.create(createdRoastId, {
      title: 'Unused variable',
      description: 'Variable x is not used',
      severity: 'warning',
      issueType: 'bad-practice',
    })

    const diff = await codeDiffRepository.create(createdRoastId, {
      removedLine: 'const x = 1',
      addedLine: null,
      context: null,
      lineNumber: 1,
    })

    const result = await useCase.execute(createdRoastId)

    expect(result).toBeDefined()
    expect(result?.roast.id).toBe(createdRoastId)
    expect(result?.issues).toHaveLength(1)
    expect(result?.issues[0].title).toBe('Unused variable')
    expect(result?.diffs).toHaveLength(1)
    expect(result?.diffs[0].removedLine).toBe('const x = 1')
  })

  it('fetches issues and diffs in parallel', async () => {
    await issueRepository.create(createdRoastId, {
      title: 'Test issue',
      description: 'Description',
      severity: 'warning',
      issueType: 'test',
    })

    await codeDiffRepository.create(createdRoastId, {
      removedLine: 'old',
      addedLine: 'new',
      context: null,
      lineNumber: 1,
    })

    const result = await useCase.execute(createdRoastId)

    expect(result?.issues).toHaveLength(1)
    expect(result?.diffs).toHaveLength(1)
  })
})
