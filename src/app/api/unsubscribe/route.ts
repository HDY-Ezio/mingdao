import { NextResponse } from 'next/server'
import { unsubscribe } from '@/lib/email-subscription'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }
    
    const success = await unsubscribe(token)
    
    return NextResponse.json({
      success,
      message: success
        ? 'You have been successfully unsubscribed'
        : 'Subscription not found',
    })
    
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}

// GET for direct unsubscribe link
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    )
  }
  
  const success = await unsubscribe(token)
  
  // 重定向到退订确认页
  return NextResponse.redirect(new URL(`/unsubscribe?success=${success}`, request.url))
}
