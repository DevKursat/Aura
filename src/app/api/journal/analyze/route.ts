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
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // AI Analysis using Claude
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
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Sen bir psikolog ve yaşam koçusun. Aşağıdaki günlük girdisini analiz et ve kişiye içgörüler sun. 
            
Analiz şunları içermeli:
- Duygusal durum değerlendirmesi
- Pozitif ve negatif düşünce kalıpları
- Öneriler ve tavsiyeler
- Motivasyon cümleleri

Günlük girdisi:
"${content}"

Yanıtını sıcak, destekleyici ve empatik bir dilde ver. Türkçe yanıt ver.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('AI service error')
    }

    const data = await response.json()
    const analysis = data.content[0]?.text || 'Analiz yapılamadı'

    return NextResponse.json({ 
      success: true,
      analysis 
    })
  } catch (error) {
    console.error('Journal analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
