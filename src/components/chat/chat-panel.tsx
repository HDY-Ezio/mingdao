'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, Lock, Crown, MessageCircle, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType, ReportType } from '@/types'
import { generateDaoistResponse, generateSystemPrompt } from '@/lib/ai-chat'

interface ChatPanelProps {
  reportType: ReportType
  reportData: Record<string, any>
  reportId?: string
  questionsUsed: number
  questionsTotal: number
  isDeepUnlocked?: boolean
  className?: string
}

export function ChatPanel({
  reportType,
  reportData,
  reportId,
  questionsUsed,
  questionsTotal,
  isDeepUnlocked = false,
  className,
}: ChatPanelProps) {
  const [messages, setMessages] = React.useState<ChatMessageType[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [usedQuestions, setUsedQuestions] = React.useState(questionsUsed)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const remainingQuestions = isDeepUnlocked 
    ? 49 - usedQuestions 
    : questionsTotal - usedQuestions
  
  const isLimitReached = remainingQuestions <= 0 && !isDeepUnlocked

  // 自动滚动到底部
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 初始欢迎消息
  React.useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg: ChatMessageType = {
        id: 'welcome',
        userId: 'system',
        conversationId: undefined,
        role: 'assistant',
        content: getWelcomeMessage(reportType),
        messageType: 'text',
        metadata: {},
        tokensUsed: 0,
        createdAt: new Date().toISOString(),
      }
      setMessages([welcomeMsg])
    }
  }, [reportType, messages.length])

  const handleSend = async () => {
    if (!input.trim() || isLoading || isLimitReached) return

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      userId: 'user',
      role: 'user',
      content: input.trim(),
      messageType: 'text',
      metadata: {},
      tokensUsed: 0,
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const { content, tokensUsed } = await generateDaoistResponse(
        userMsg.content,
        reportType,
        reportData,
        messages
      )

      const assistantMsg: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        userId: 'system',
        role: 'assistant',
        content,
        messageType: 'text',
        metadata: { tokensUsed },
        tokensUsed,
        createdAt: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMsg])
      setUsedQuestions(prev => prev + 1)
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/60 overflow-hidden', className)}>
      {/* 聊天头部 */}
      <div className="px-4 py-3 border-b border-ink-200/50 bg-gradient-to-r from-jade-50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-jade-400 to-jade-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-jade-500 border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-semibold text-ink-900 text-sm">
                清风道长
                <span className="text-xs font-normal text-ink-500 ml-1">Qingfeng Master</span>
              </h3>
            </div>
            <p className="text-xs text-ink-500">
              {isDeepUnlocked ? (
                <span className="text-gold-600">Deep Mode · 深度模式</span>
              ) : (
                <span>{remainingQuestions} questions remaining / 剩余{remainingQuestions}次问道</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-jade-400 to-jade-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-jade-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-jade-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-jade-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-jade-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 升级提示 */}
      {isLimitReached && !isDeepUnlocked && (
        <div className="px-4 py-3 bg-gold-50 border-t border-gold-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-900">
                Unlock 49 Deep Questions
              </p>
              <p className="text-xs text-ink-500">
                解锁七七四十九次深度问道
              </p>
            </div>
            <Button variant="gold" size="sm">
              $9.90
            </Button>
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="p-3 border-t border-ink-200/50 bg-white/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLimitReached && !isDeepUnlocked 
              ? "Question limit reached / 已达问答上限" 
              : "Ask the Master anything about your report... / 向道长请益..."
            }
            disabled={isLimitReached && !isDeepUnlocked}
            className="flex-1 h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-jade-400/50 focus:border-jade-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            variant="gold"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || (isLimitReached && !isDeepUnlocked)}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-ink-400 mt-2 text-center">
          问道须诚心，言出法随 · Ask with sincerity
        </p>
      </div>
    </div>
  )
}

function ChatMessageItem({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser 
          ? 'bg-gradient-to-br from-gold-400 to-gold-600' 
          : 'bg-gradient-to-br from-jade-400 to-jade-600'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={cn(
        'rounded-2xl px-4 py-3 max-w-[80%]',
        isUser 
          ? 'bg-gold-50 border border-gold-100 rounded-tr-sm' 
          : 'bg-jade-50 border border-jade-100/50 rounded-tl-sm'
      )}>
        <div 
          className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
        />
      </div>
    </div>
  )
}

function formatMessage(content: string): string {
  // 简单的格式化：加粗 **text** 变为 <strong>
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-ink-900">$1</strong>')
  // 换行保留
  formatted = formatted.replace(/\n/g, '<br />')
  return formatted
}

function getWelcomeMessage(type: ReportType): string {
  const messages: Record<ReportType, string> = {
    bazi: `善哉善哉，施主有礼了。贫道清风，来自武当山。

既然施主已得八字命盘，有何疑问尽管问来。
无论是事业、感情、财运还是健康，贫道都可为你参详一二。

**请记住 Remember：**
命由己造，福自我求。八字只是地图，路还是要自己走。

施主请问——`,
    ziwei: `无量天尊，施主好。贫道清风。

紫微斗数乃是帝王之学，十二宫包罗万象。
施主既已得盘，有什么想了解的尽管开口。

无论是命宫格局、财帛官禄，还是夫妻感情，
贫道都可为你细细道来。

施主请问——`,
    iching: `善哉。《易经》有云："寂然不动，感而遂通。"

施主既已起卦，卦象已明。有什么疑问，
尽管问来。无论是吉凶悔吝，还是进退取舍，
贫道都可为你解说卦中深意。

不过请记住：**卦不妄起，易不占险**。
诚心所至，金石为开。

施主请问——`,
    relationship: `阿弥陀佛，感情之事，最为微妙。

施主既已求得感情专项报告，想必心中有所牵挂。
无论是正缘何时出现、感情中遇到的困惑，
还是如何经营一段关系，贫道都可为你参详。

感情如人饮水，冷暖自知。
但命盘之中，自有定数与变数。

施主请问——`,
    career: `善哉善哉，事业功名，人之大欲也。

施主既问事业财运，想必正处于人生的关键节点。
无论是方向选择、时机把握，还是投资理财，
贫道都可从你命局中为你寻得线索。

但请记住：**天道酬勤，地道酬善**。
命好不如运好，运好不如人好。

施主请问——`,
    compatibility: `合婚之道，博大精深。

施主既已得双人合盘，想必对这段关系有所期许或困惑。
无论是相处之道、未来发展，还是如何化解矛盾，
贫道都可为你细细分析。

好的姻缘，是两个人互相成就，
而不是彼此消耗。

施主请问——`,
  }

  return messages[type] || messages.bazi
}
