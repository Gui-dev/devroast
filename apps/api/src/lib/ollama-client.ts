interface OllamaIssue {
  title: string
  description: string
  severity: 'critical' | 'warning' | 'good'
  issueType: string
}

interface OllamaAnalysis {
  roastQuote: string
  issues: OllamaIssue[]
  suggestedFix: string
  score: number
}

type RoastMode = 'honest' | 'roast'

export interface OllamaClientInterface {
  analyze(code: string, language: string, roastMode: RoastMode): Promise<OllamaAnalysis>
}

export class OllamaClient implements OllamaClientInterface {
  private baseUrl: string
  private model: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5-coder:1.5b'
  }

  async analyze(code: string, language: string, roastMode: RoastMode): Promise<OllamaAnalysis> {
    const prompt = this.buildPrompt(code, language, roastMode)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Ollama unavailable: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as { response: string }
      return JSON.parse(data.response) as OllamaAnalysis
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Ollama timeout: request took longer than 60 seconds')
      }
      if (error instanceof Error && error.message.startsWith('Ollama unavailable')) {
        throw error
      }
      throw new Error(
        `Ollama unavailable: ${error instanceof Error ? error.message : 'unknown error'}`
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  private buildPrompt(code: string, language: string, roastMode: RoastMode): string {
    const tone =
      roastMode === 'roast'
        ? 'Be brutally honest and sarcastic. Use developer humor.'
        : 'Provide constructive feedback, be friendly and helpful.'

    return `Analyze this ${language} code and provide a JSON response with:
1. "roastQuote": A roasting quote (1-2 sentences, funny/sarcastic about the code quality)
2. "issues": Array of issues, each with:
   - "title": Short descriptive title
   - "description": Detailed explanation
   - "severity": "critical" | "warning" | "good"
   - "issueType": Type of issue (e.g., "bad-practice", "security", "performance")
3. "suggestedFix": Unified diff format showing improvements
4. "score": Number from 0-10 rating the code quality

${tone}
Respond ONLY with valid JSON, no explanations.

Code to analyze:
---
${code}
---
`
  }
}
