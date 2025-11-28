import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AD_REWARDS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { adType, adNetwork, adUnitId } = body

    if (!adType || !adNetwork) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0]
    const { count: todayCount } = await supabase
      .from('ad_rewards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('ad_type', adType)
      .gte('created_at', today)

    const limits = adType === 'rewarded_video' 
      ? AD_REWARDS.rewarded_video.daily_limit 
      : AD_REWARDS.rewarded_interstitial.daily_limit

    if ((todayCount || 0) >= limits) {
      return NextResponse.json(
        { error: 'Daily ad limit reached', limit: limits },
        { status: 429 }
      )
    }

    // Calculate reward
    const rewardConfig = adType === 'rewarded_video' 
      ? AD_REWARDS.rewarded_video 
      : AD_REWARDS.rewarded_interstitial

    const coinsRewarded = Math.floor(
      Math.random() * (rewardConfig.max - rewardConfig.min + 1) + rewardConfig.min
    )

    // Add coins
    const { data: newBalance } = await supabase.rpc('add_coins', {
      p_user_id: user.id,
      p_amount: coinsRewarded,
      p_type: 'reward_ad',
      p_description: `Ad reward (${adNetwork})`,
    })

    // Record ad reward
    await supabase.from('ad_rewards').insert({
      user_id: user.id,
      ad_network: adNetwork,
      ad_type: adType,
      ad_unit_id: adUnitId,
      coins_rewarded: coinsRewarded,
    })

    return NextResponse.json({
      success: true,
      coins_rewarded: coinsRewarded,
      new_balance: newBalance,
      remaining_today: limits - (todayCount || 0) - 1,
    })
  } catch (error) {
    console.error('Ad reward error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
