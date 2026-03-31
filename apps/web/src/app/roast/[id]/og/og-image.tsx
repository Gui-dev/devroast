export interface OgImageProps {
  score: number
  verdict: string
  language: string
  lineCount: number
  roastQuote: string
}

function getScoreColor(score: number): string {
  if (score >= 7) return '#10B981'
  if (score >= 4) return '#F59E0B'
  return '#EF4444'
}

function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'needs_serious_help':
    case 'critical':
      return '#EF4444'
    case 'warning':
      return '#F59E0B'
    case 'good':
      return '#10B981'
    default:
      return '#FAFAFA'
  }
}

export function OgImage({ score, verdict, language, lineCount, roastQuote }: OgImageProps) {
  const scoreColor = getScoreColor(score)
  const verdictColor = getVerdictColor(verdict)
  const displayVerdict = verdict.replace(/_/g, ' ')

  return (
    <div tw="w-full h-full bg-[#0A0A0A] border border-[#2A2A2A] flex flex-col items-center justify-center gap-7 p-16">
      {/* Logo row */}
      <div tw="flex items-center gap-2">
        <span tw="text-[#10B981] text-2xl font-bold">&gt;</span>
        <span tw="text-[#FAFAFA] text-xl">devroast</span>
      </div>

      {/* Score row */}
      <div tw="flex items-end gap-1">
        <span tw="font-black leading-none" style={{ fontSize: 160, color: scoreColor }}>
          {score}
        </span>
        <span tw="text-[#4B5563] leading-none" style={{ fontSize: 56 }}>
          /10
        </span>
      </div>

      {/* Verdict row */}
      <div tw="flex items-center gap-2">
        <div tw="rounded-full" style={{ width: 12, height: 12, backgroundColor: verdictColor }} />
        <span style={{ fontSize: 20, color: verdictColor }}>{displayVerdict}</span>
      </div>

      {/* Lang info */}
      <span tw="text-[#4B5563] text-base">
        lang: {language} · {lineCount} lines
      </span>

      {/* Quote */}
      <p tw="text-[#FAFAFA] text-center max-w-xl" style={{ fontSize: 22, lineHeight: 1.5 }}>
        {roastQuote}
      </p>
    </div>
  )
}
