import { generateObject } from 'ai'
import { type OllamaProvider, createOllama } from 'ai-sdk-ollama'
import { type AnalysisResult, AnalysisResultSchema } from './analysis-schema'

export class OllamaClient {
  private model: ReturnType<OllamaProvider>

  constructor(baseUrl: string, modelName: string) {
    const ollama = createOllama({ baseURL: baseUrl })
    this.model = ollama(modelName)
  }

  async analyzeCode(
    code: string,
    language: string,
    mode: 'roast' | 'honest'
  ): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(code, language, mode)

    const { object } = await generateObject({
      model: this.model,
      schema: AnalysisResultSchema,
      prompt,
      abortSignal: AbortSignal.timeout(300000),
    })

    return object
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
3. "suggestedFix": A unified diff string showing the exact code changes needed. Use the format:
   Lines starting with "-" are removed (bad code)
   Lines starting with "+" are added (improved code)
   Lines without prefix are context (unchanged)
   Example: "- var x = 1;\n+ const x = 1;\n  console.log(x);"
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
