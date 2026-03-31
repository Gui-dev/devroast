import { getOgScoreColor } from '@/lib/get-og-score-color'
import { getVerdictColor } from '@/lib/get-verdict-color'

export interface OgImageProps {
  score: number
  verdict: string
  language: string
  lineCount: number
  roastQuote: string | null
}

export function OgImage({ score, verdict, language, lineCount, roastQuote }: OgImageProps) {
  const scoreColor = getOgScoreColor(score)
  const verdictColor = getVerdictColor(verdict)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 64,
        width: 1200,
        height: 630,
        backgroundColor: '#0A0A0A',
        border: '1px solid #2A2A2A',
        fontFamily: 'Geist Mono, monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'flex-start',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>{'>'}</span>
        <span style={{ fontSize: 20, color: '#FAFAFA' }}>devroast</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 160, fontWeight: '900', color: scoreColor }}>{score}</span>
        <span style={{ fontSize: 56, color: '#4B5563' }}>/10</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: verdictColor,
          }}
        />
        <span style={{ fontSize: 20, color: verdictColor }}>{verdict.replace(/_/g, ' ')}</span>
      </div>

      <div style={{ fontSize: 16, color: '#4B5563' }}>
        lang: {language} · {lineCount} lines
      </div>

      {roastQuote && (
        <p
          style={{
            fontSize: 22,
            color: '#FAFAFA',
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: 800,
            margin: 0,
          }}
        >
          "{roastQuote}"
        </p>
      )}
    </div>
  )
}
