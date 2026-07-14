import { NextResponse } from 'next/server'
import { subscribe, getSubscriptionByEmail } from '@/lib/email-subscription'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, preferences } = body
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // 检查是否已订阅
    const existing = await getSubscriptionByEmail(email)
    
    const subscription = await subscribe({
      email,
      name,
      preferences,
    })
    
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        email: subscription.email,
        isActive: subscription.isActive,
        wasReactivated: !!existing && !existing.isActive,
      },
      message: existing?.isActive
        ? 'You are already subscribed'
        : 'Successfully subscribed to daily fortune emails',
    })
    
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
