import { fetchRoast } from '@/app/hooks/use-roast'
import { ImageResponse } from '@takumi-rs/image-response'
import { OgImage } from './og-image'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const roast = await fetchRoast(id)
    return new ImageResponse(
      <OgImage
        score={roast.score}
        verdict={roast.verdict}
        language={roast.language}
        lineCount={roast.lineCount}
        roastQuote={roast.roastQuote}
      />,
      { width: 1200, height: 630 }
    ) as Response
  } catch {
    return new Response('Roast not found', { status: 404 })
  }
}
