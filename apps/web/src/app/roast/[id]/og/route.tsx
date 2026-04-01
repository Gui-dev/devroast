import { fetchRoast } from '@/app/hooks/use-roast'
import { ImageResponse } from 'takumi-js/response'
import { OgImage } from './og-image'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const roast = await fetchRoast(id)
    return new ImageResponse(
      <OgImage
        score={roast.score}
        verdict={roast.verdict}
        language={roast.language}
        lineCount={roast.lineCount}
        roastQuote={roast.roastQuote ?? ''}
      />,
      { width: 1200, height: 630 }
    )
  } catch (error) {
    console.error('Failed to generate OG image for roast:', id, error)
    return new ImageResponse(
      <div tw="w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 p-16">
        <span tw="text-[#10B981] text-2xl font-bold">&gt;</span>
        <span tw="text-[#FAFAFA] text-xl">devroast</span>
        <span tw="text-[#4B5563] text-xl">Roast not found</span>
      </div>,
      { width: 1200, height: 630 }
    )
  }
}
