interface AnalysisResult {
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

interface OllamaResponse {
  response: string
}

export class OllamaClient {
  constructor(
    private readonly baseUrl: string,
    private readonly model: string
  ) {}

  async analyzeCode(
    code: string,
    language: string,
    mode: 'roast' | 'honest'
  ): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(code, language, mode)

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(300000),
    })

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`)
    }

    const data = (await response.json()) as OllamaResponse
    let parsed: AnalysisResult

    try {
      let cleanResponse = data.response
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim()

      const firstBrace = cleanResponse.indexOf('{')
      const lastBrace = cleanResponse.lastIndexOf('}')

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1)
      }

      parsed = JSON.parse(cleanResponse)
    } catch {
      parsed = { roastQuote: '', issues: [], suggestedFix: '', score: 5 }
      const jsonObjects = data.response.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)
      if (jsonObjects) {
        for (const obj of jsonObjects) {
          try {
            const candidate = JSON.parse(obj)
            if (candidate.roastQuote || candidate.issues || candidate.score !== undefined) {
              parsed = candidate
              break
            }
          } catch {
            // skip invalid JSON
          }
        }
      }
      if (!parsed.roastQuote && !parsed.issues.length) {
        console.error('AI response:', data.response)
        throw new Error('Failed to parse AI response')
      }
    }

    // Validate the structure of the parsed object with fallbacks
    let suggestedFixValue = ''
    if (typeof parsed.suggestedFix === 'string') {
      suggestedFixValue = parsed.suggestedFix
    } else if (typeof parsed.suggestedFix === 'object' && parsed.suggestedFix !== null) {
      suggestedFixValue = JSON.stringify(parsed.suggestedFix)
    }

    const issues = Array.isArray(parsed.issues)
      ? parsed.issues.map(issue => ({
          title: typeof issue.title === 'string' ? issue.title : 'Untitled',
          description: typeof issue.description === 'string' ? issue.description : '',
          severity: ['critical', 'warning', 'good'].includes(issue.severity)
            ? issue.severity
            : 'warning',
          issueType: typeof issue.issueType === 'string' ? issue.issueType : 'general',
        }))
      : []

    const result: AnalysisResult = {
      roastQuote:
        typeof parsed.roastQuote === 'string' ? parsed.roastQuote : 'No roast quote provided',
      issues,
      suggestedFix: suggestedFixValue,
      score: typeof parsed.score === 'number' ? Math.max(0, Math.min(10, parsed.score)) : 5,
    }

    return result
  }

  private buildPrompt(code: string, language: string, mode: 'roast' | 'honest'): string {
    const tone =
      mode === 'roast'
        ? 'Be brutally honest and sarcastic. Use developer humor.'
        : 'Provide constructive feedback with a friendly tone.'

    return `
Analyze this ${language} code and provide a JSON response with:
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
`.trim()
  }
}
