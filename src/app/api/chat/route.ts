import { NextResponse } from 'next/server'
import { generateDaoistResponse } from '@/lib/ai-chat'
import type { ChatMessage, ReportType } from '@/types'

// POST /api/chat
// AI对话接口 - 向清风道长提问
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      message, 
      reportType, 
      reportData, 
      conversationHistory = [],
      reportId,
      conversationId,
    } = body

    if (!message || !reportType) {
      return NextResponse.json(
        { error: 'Missing required fields: message and reportType' },
        { status: 400 }
      )
    }

    // 调用AI生成回复
    const { content, tokensUsed } = await generateDaoistResponse(
      message,
      reportType as ReportType,
      reportData,
      conversationHistory as ChatMessage[]
    )

    // TODO: 保存到数据库（需要用户认证）
    // const supabase = createClient()
    // 保存消息到 chat_messages 表

    return NextResponse.json({
      content,
      tokensUsed,
      role: 'assistant',
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

// GET /api/chat
// 获取对话历史
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  const reportId = searchParams.get('reportId')

  // TODO: 从数据库获取对话历史
  // const supabase = createClient()
  // const { data: messages } = await supabase
  //   .from('chat_messages')
  //   .select('*')
  //   .eq('conversation_id', conversationId)
  //   .order('created_at', { ascending: true })

  return NextResponse.json({
    messages: [],
    conversationId: conversationId || null,
    reportId: reportId || null,
  })
}
