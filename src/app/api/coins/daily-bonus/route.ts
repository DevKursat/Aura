import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DAILY_BONUSES } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_days, last_active_at')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0]
    
    // Check if already claimed today
    if (profile.last_active_at === today) {
      return NextResponse.json(
        { error: 'Already claimed today', claimed: true },
        { status: 400 }
      )
    }

    // Calculate streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    let newStreak = 1
    if (profile.last_active_at === yesterdayStr) {
      newStreak = profile.streak_days + 1
    }

    // Calculate bonus with multiplier
    let bonus = DAILY_BONUSES.login
    const multipliers = DAILY_BONUSES.streak_multiplier

    if (newStreak >= 100 && multipliers[100]) {
      bonus *= multipliers[100]
    } else if (newStreak >= 30 && multipliers[30]) {
      bonus *= multipliers[30]
    } else if (newStreak >= 7 && multipliers[7]) {
      bonus *= multipliers[7]
    }

    // Add coins
    const { data: newBalance } = await supabase.rpc('add_coins', {
      p_user_id: user.id,
      p_amount: bonus,
      p_type: 'daily_bonus',
      p_description: `Daily login bonus (${newStreak} day streak)`,
    })

    // Update streak
    await supabase
      .from('profiles')
      .update({
        streak_days: newStreak,
        last_active_at: today,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      coins_rewarded: bonus,
      new_balance: newBalance,
      streak: newStreak,
    })
  } catch (error) {
    console.error('Daily bonus error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
