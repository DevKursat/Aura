import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFortuneImage, generateDreamImage } from '@/lib/ai/image-ai'
import { COIN_COSTS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      type, 
      referenceId, 
      dreamContent, 
      symbols, 
      emotions,
      highlights,
      fortuneType 
    } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Missing type parameter' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isPremium = profile.subscription_tier === 'premium'
    const coinCost = isPremium ? 0 : COIN_COSTS.dream_image

    // Check coins
    if (!isPremium && profile.coins < coinCost) {
      return NextResponse.json(
        { error: 'Insufficient coins', required: coinCost, current: profile.coins },
        { status: 402 }
      )
    }

    let imageResult

    if (type === 'dream') {
      if (!dreamContent) {
        return NextResponse.json(
          { error: 'Missing dreamContent' },
          { status: 400 }
        )
      }
      imageResult = await generateDreamImage(
        dreamContent,
        symbols || [],
        emotions || []
      )
    } else if (type === 'fortune') {
      if (!fortuneType || !highlights) {
        return NextResponse.json(
          { error: 'Missing fortuneType or highlights' },
          { status: 400 }
        )
      }
      imageResult = await generateFortuneImage(fortuneType, highlights)
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      )
    }

    // Deduct coins if not premium
    if (!isPremium) {
      await supabase.rpc('spend_coins', {
        p_user_id: user.id,
        p_amount: coinCost,
        p_description: `${type} image generation`,
        p_reference_id: referenceId || null,
      })
    }

    // Update reference with image URL if provided
    if (referenceId) {
      if (type === 'dream') {
        await supabase
          .from('dream_entries')
          .update({ generated_image_url: imageResult.url })
          .eq('id', referenceId)
          .eq('user_id', user.id)
      } else if (type === 'fortune') {
        await supabase
          .from('fortune_readings')
          .update({ generated_image_url: imageResult.url })
          .eq('id', referenceId)
          .eq('user_id', user.id)
      }
    }

    return NextResponse.json({
      success: true,
      image: imageResult,
      coins_spent: isPremium ? 0 : coinCost,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
