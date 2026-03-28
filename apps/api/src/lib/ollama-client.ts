export interface OllamaResponse {
  roastQuote: string
  issues: Array<{
    title: string
    description: string
    severity: 'critical' | 'warning' | 'good'
    issueType: string
  }>
  suggestedFix: string
  score: number
}

export class OllamaClient {
  private readonly baseUrl: string
  private readonly model: string

  constructor(baseUrl: string, model: string) {
    this.baseUrl = baseUrl
    this.model = model
  }

  async analyze(
    code: string,
    language: string,
    roastMode: 'honest' | 'roast'
  ): Promise<OllamaResponse> {
    const prompt = this.buildPrompt(code, language, roastMode)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: prompt.system,
            },
            {
              role: 'user',
              content: prompt.user,
            },
          ],
          stream: false,
        }),
        signal: controller.signal,
      })
    } catch (error) {
      clearTimeout(timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Ollama timeout')
      }
      throw new Error('Ollama unavailable')
    }

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error('Ollama unavailable')
    }

    const data = (await response.json()) as { message?: { content?: string } }
    const content = data.message?.content

    if (!content) {
      throw new Error('Failed to parse AI response')
    }

    try {
      const parsed = JSON.parse(content) as OllamaResponse
      return parsed
    } catch {
      throw new Error('Failed to parse AI response')
    }
  }

  private buildPrompt(code: string, language: string, roastMode: 'honest' | 'roast') {
    const toneInstruction =
      roastMode === 'roast'
        ? 'Be brutally honest and sarcastic. Use developer humor.'
        : 'Provide constructive feedback. Be friendly but honest.'

    const system = [
      `Analyze this ${language} code and provide a JSON response with:`,
      '1. "roastQuote": A roasting quote (1-2 sentences, funny/sarcastic about the code quality)',
      '2. "issues": Array of issues, each with:',
      '   - "title": Short descriptive title',
      '   - "description": Detailed explanation',
      '   - "severity": "critical" | "warning" | "good"',
      '   - "issueType": Type of issue (e.g., "bad-practice", "security", "performance")',
      '3. "suggestedFix": Unified diff format showing improvements',
      '4. "score": Number from 0-10 rating the code quality',
      '',
      toneInstruction,
      'Respond ONLY with valid JSON, no explanations.',
    ].join('\n')

    const user = `Code to analyze:\n---\n${code}\n---`

    return { system, user }
  }
}
