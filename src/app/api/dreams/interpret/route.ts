import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dreamContent } = body

    if (!dreamContent) {
      return NextResponse.json(
        { error: 'Dream content is required' },
        { status: 400 }
      )
    }

    // AI Dream Interpretation using Claude
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY

    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Sen deneyimli bir rüya yorumcususun. Hem psikolojik hem de mistik/geleneksel yaklaşımları birleştiriyorsun.

Aşağıdaki rüyayı detaylı şekilde yorumla:

"${dreamContent}"

Yorumun şunları içermeli:

🔮 **Genel Yorum**: Rüyanın genel anlamı ve mesajı

🎭 **Semboller ve Anlamları**: Rüyadaki önemli semboller ve ne ifade ettikleri

💭 **Bilinçaltı Mesajlar**: Rüyanın bilinçaltından gelen mesajları

🌟 **Gelecek İşaretleri**: Rüyanın hayatla ilgili olası işaretleri

💡 **Tavsiyeler**: Rüya ışığında hayat tavsiyeleri

Yanıtını sıcak, mistik ama bilgece bir dilde ver. Türkçe yanıt ver.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('AI service error')
    }

    const data = await response.json()
    const interpretation = data.content[0]?.text || 'Yorum yapılamadı'

    return NextResponse.json({ 
      success: true,
      interpretation 
    })
  } catch (error) {
    console.error('Dream interpretation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
