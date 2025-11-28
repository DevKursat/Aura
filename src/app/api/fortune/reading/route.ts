import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateFortuneReading } from '@/lib/ai/fortune-ai'
import { COIN_COSTS } from '@/lib/constants'
import type { FortuneType } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, input, language = 'tr' } = body as {
      type: FortuneType
      input: Record<string, unknown>
      language: 'tr' | 'en'
    }

    if (!type || !input) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if user has free reading today
    const { data: todayReadings } = await supabase
      .from('fortune_readings')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', type)
      .eq('is_free', true)
      .gte('created_at', new Date().toISOString().split('T')[0])

    const hasFreeReading = (todayReadings?.length || 0) === 0
    const isPremium = profile.subscription_tier === 'premium'
    const isPlus = profile.subscription_tier === 'plus'

    // Determine cost
    let coinCost = 0
    let isFree = false

    if (isPremium) {
      // Premium users get unlimited free readings
      isFree = true
    } else if (isPlus && (todayReadings?.length || 0) < 10) {
      // Plus users get 10 free per day
      isFree = true
    } else if (hasFreeReading) {
      // Free users get 1 free per type per day
      isFree = true
    } else {
      // Charge coins
      coinCost = COIN_COSTS[type as keyof typeof COIN_COSTS] || 30

      if (profile.coins < coinCost) {
        return NextResponse.json(
          { error: 'Insufficient coins', required: coinCost, current: profile.coins },
          { status: 402 }
        )
      }
    }

    // Generate reading
    const reading = await generateFortuneReading({
      type,
      input,
      language,
      userId: user.id,
    })

    // Deduct coins if not free
    if (coinCost > 0) {
      await supabase.rpc('spend_coins', {
        p_user_id: user.id,
        p_amount: coinCost,
        p_description: `${type} reading`,
        p_reference_id: null,
      })
    }

    // Save reading
    const { data: savedReading, error: saveError } = await supabase
      .from('fortune_readings')
      .insert({
        user_id: user.id,
        type,
        input_data: input,
        reading_text: reading.text,
        reading_summary: reading.summary,
        reading_highlights: reading.highlights,
        coins_spent: coinCost,
        is_free: isFree,
        language,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving reading:', saveError)
    }

    // Update total readings count
    await supabase
      .from('profiles')
      .update({ total_readings: profile.coins + 1 })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      reading: {
        id: savedReading?.id,
        ...reading,
      },
      coins_spent: coinCost,
      is_free: isFree,
    })
  } catch (error) {
    console.error('Fortune reading error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
