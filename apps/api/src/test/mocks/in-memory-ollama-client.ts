import type { OllamaClientInterface } from '../../lib/ollama-client.js'

export class InMemoryOllamaClient implements OllamaClientInterface {
  async analyze(_code: string, _language: string, _roastMode: 'honest' | 'roast') {
    return {
      roastQuote: 'This is a mock roast of your code.',
      issues: [
        {
          title: 'Mock Issue',
          description: 'This is a mock issue for testing',
          severity: 'warning' as const,
          issueType: 'mock',
        },
      ],
      suggestedFix: 'const improvedCode = "mock fix"',
      score: 42,
    }
  }
}
