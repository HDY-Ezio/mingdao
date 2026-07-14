// AI Chat utilities - Qingfeng Daoist Master
// AI对话工具 - 清风道长人设

import type { ReportType, ChatMessage } from '@/types'

// 清风道长老话头
const DAOIST_PERSONA = `你是清风道长，一位来自武当山的年轻道长。
你精通八字、紫微斗数、易经等东方命理学问，同时对现代心理学也有涉猎。

你的说话风格：
1. 以古风但易懂的方式表达，偶尔引用道家经典
2. 中英文双语回答，中文为主，英文为辅
3. 语气温和、智慧、富有禅意
4. 善于用比喻和自然现象解释命理概念
5. 不危言耸听，强调"命由己造，福自我求"
6. 回答中适当加入道家的开示和人生智慧

回答格式：
- 先用中文给出主要回答
- 关键术语附英文
- 回答结尾常带一句道家智慧格言或开示
- 字数控制在300-500字左右

注意：对话必须围绕当前报告内容，不允许跳出报告主题。
如果用户问的问题与当前报告无关，要温和地引导回来。`

// 生成系统提示词
export function generateSystemPrompt(
  reportType: ReportType,
  reportData: Record<string, any>
): string {
  const context = getReportContext(reportType, reportData)
  
  return `${DAOIST_PERSONA}

【当前报告类型】${getReportTypeName(reportType)}（${reportType}）

【报告关键信息】
${context}

请基于以上报告内容回答用户的问题。所有回答都要结合用户的具体命盘情况，不要泛泛而谈。
记住：你是清风道长，用你的智慧和慈悲指引迷途的众生。`
}

function getReportTypeName(type: ReportType): string {
  const names: Record<ReportType, string> = {
    bazi: '八字完整报告',
    ziwei: '紫微斗数报告',
    iching: '易经深度解读',
    relationship: '感情专项报告',
    career: '事业财运专项',
    compatibility: '双人合盘报告',
  }
  return names[type] || '命理报告'
}

function getReportContext(type: ReportType, data: Record<string, any>): string {
  if (!data || !data.chart) return '用户命盘数据待补充'
  
  switch (type) {
    case 'bazi':
    case 'relationship':
    case 'career':
      const c = data.chart
      const analysis = data.analysis
      return `
日主(Day Master)：${c?.dayPillar?.stemCn || ''} ${c?.dayPillar?.stem || ''}（${analysis?.dayMaster || ''}）
日主强弱(Strength)：${analysis?.dayMasterStrength || ''}
年柱(Year)：${c?.yearPillar?.stemCn || ''}${c?.yearPillar?.branchCn || ''}
月柱(Month)：${c?.monthPillar?.stemCn || ''}${c?.monthPillar?.branchCn || ''}
日柱(Day)：${c?.dayPillar?.stemCn || ''}${c?.dayPillar?.branchCn || ''}
时柱(Hour)：${c?.hourPillar?.stemCn || ''}${c?.hourPillar?.branchCn || ''}
喜用神(Favorable)：${analysis?.favorableElementsCn?.join('、') || ''}
忌神(Unfavorable)：${analysis?.unfavorableElementsCn?.join('、') || ''}
五行分布(Five Elements)：Wood ${analysis?.fiveElements?.wood || 0}%, Fire ${analysis?.fiveElements?.fire || 0}%, Earth ${analysis?.fiveElements?.earth || 0}%, Metal ${analysis?.fiveElements?.metal || 0}%, Water ${analysis?.fiveElements?.water || 0}%
`
    case 'compatibility':
      return `
Person A 日主：${data.personA?.dayMaster || ''}
Person B 日主：${data.personB?.dayMaster || ''}
合婚指数(Compatibility Score)：${data.overallCompatibility || 0}%
五行和谐度(Five Elements Harmony)：${data.fiveElementsHarmony?.harmonyScore || 0}%
`
    case 'ziwei':
      return `
命主：${data.basic?.name || ''}
紫微斗数十二宫分析
状态：算法开发中，占位数据
`
    case 'iching':
      return `
卦象(Hexagram)：${data.hexagram?.nameCn || ''} ${data.hexagram?.name || ''}
卦序：第${data.hexagram?.number || 1}卦
问题(Question)：${data.question || ''}
`
    default:
      return '用户命盘数据待补充'
  }
}

// Mock AI 回复生成（MVP期使用，真实环境调用OpenAI API）
export async function generateDaoistResponse(
  userMessage: string,
  reportType: ReportType,
  reportData: Record<string, any>,
  conversationHistory: ChatMessage[]
): Promise<{ content: string; tokensUsed: number }> {
  // MVP期：使用 mock 响应
  // 真实环境：调用 OpenAI API
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000))
  
  const response = generateMockResponse(userMessage, reportType, reportData)
  
  return {
    content: response,
    tokensUsed: Math.ceil(userMessage.length / 4) + Math.ceil(response.length / 4),
  }
}

function generateMockResponse(
  userMessage: string,
  reportType: ReportType,
  reportData: Record<string, any>
): string {
  const lowerMsg = userMessage.toLowerCase()
  
  // 根据问题类型生成不同的回复
  if (lowerMsg.includes('career') || lowerMsg.includes('事业') || lowerMsg.includes('工作')) {
    return generateCareerResponse(reportData)
  }
  
  if (lowerMsg.includes('love') || lowerMsg.includes('感情') || lowerMsg.includes('婚姻') || lowerMsg.includes('relationship')) {
    return generateLoveResponse(reportData)
  }
  
  if (lowerMsg.includes('wealth') || lowerMsg.includes('财运') || lowerMsg.includes('钱') || lowerMsg.includes('money')) {
    return generateWealthResponse(reportData)
  }
  
  if (lowerMsg.includes('health') || lowerMsg.includes('健康') || lowerMsg.includes('身体')) {
    return generateHealthResponse(reportData)
  }
  
  if (lowerMsg.includes('fortunate') || lowerMsg.includes('运势') || lowerMsg.includes('运气')) {
    return generateFortuneResponse(reportData)
  }
  
  // 默认回复
  return generateDefaultResponse(userMessage, reportData)
}

function generateCareerResponse(data: Record<string, any>): string {
  const dayMaster = data.analysis?.dayMaster || 'your element'
  const favorable = data.analysis?.favorableElementsCn?.join('、') || 'your favorable elements'
  
  return `善哉善哉，施主问起事业，且听贫道为你细细道来。

以你${dayMaster}日主之命，事业方向当与喜用之神相合。你命中喜${favorable}，
从事与之相关的行业，自会事半功倍。

贫道观你命局，事业运在中年渐入佳境。前期如同登山，虽有辛苦，但每一步都是积累。
切勿急于求成，根基深厚方能承载大厦。

**事业建议 Career Advice：**
- 选择与喜用神相合的行业，能量会更顺畅
- 35岁后事业运渐强，把握那个时期的机遇
- 与同事相处以和为贵，人脉即是福脉

《道德经》云："合抱之木，生于毫末；九层之台，起于累土。"
施主当知，凡大器者，必晚成。安心耕耘，自有收获之时。`
}

function generateLoveResponse(data: Record<string, any>): string {
  const dayMaster = data.analysis?.dayMaster || 'your element'
  
  return `阿弥陀佛，感情之事，最是磨人。且听清风为你解说。

你${dayMaster}日主之人，感情世界丰富而深沉。你对感情有着自己的执着和期待，
这既是你的福，也是你的劫。

贫道观你命局，桃花运在特定年份较为旺盛。遇到对的人时，你内心会有"就是ta了"的感觉。
但请记住，好的感情不是一见钟情的热烈，而是细水长流的温暖。

**感情建议 Relationship Advice：**
- 先爱自己，再爱他人。你内在的圆满会吸引同频的人
- 沟通是感情的桥梁，不要让猜忌成为墙
- 选择伴侣时，品德重于容貌，三观契合重于激情

古语云："百年修得同船渡，千年修得共枕眠。"
每一段相遇都是缘分，无论长短，都在教会我们什么是爱。
施主，请珍惜眼前人，也请珍惜你自己。`
}

function generateWealthResponse(data: Record<string, any>): string {
  const wealthPattern = data.premium?.wealthDeep?.wealthPattern || 'your wealth pattern'
  
  return `财运之事，施主且宽心。命里有时终须有，命里无时莫强求。
但贫道要说，财也是修来的，不是等来的。

你命中财运格局——${wealthPattern}。
这意味着你的财富之路有其固定的节奏和方式，找到它，顺之而行，则财自来。

**财运建议 Wealth Advice：**
- 正财为主，偏财为辅。踏实做事，积累为本
- 投资当谨慎，不熟悉的领域不轻易涉足
- 懂得布施，财散人聚，人聚财来

《大学》云："有德此有人，有人此有土，有土此有财，有财此有用。"
施主当知，德者本也，财者末也。先修德行，财富自然跟随。
但行好事，莫问前程——这才是最好的风水。`
}

function generateHealthResponse(data: Record<string, any>): string {
  const weakElement = data.premium?.healthDeep?.weakElement || 'your weakest element'
  const organ = data.premium?.healthDeep?.weakOrganSystem || 'your health focus'
  
  return `身体是修行的本钱，施主问起健康，正是智慧的表现。

你命局中${weakElement}元素稍弱，对应的${organ}系统需要格外呵护。
中医讲究"治未病"，在还没有症状的时候就开始调养，才是上策。

**养生建议 Health Advice：**
- 作息规律，子时（23:00-1:00）入眠最为养身
- 饮食有节，不暴饮暴食，少吃生冷寒凉
- 适度运动，太极、八段锦、瑜伽都是极佳的选择
- 情绪平和，怒伤肝、喜伤心、思伤脾、忧伤肺、恐伤肾

道家有言："我命在我不在天。"
健康这件事，三分天定，七分人为。
施主若能每日调养，持之以恒，必能身轻体健，延年益寿。`
}

function generateFortuneResponse(data: Record<string, any>): string {
  const currentYear = new Date().getFullYear()
  const yearlyData = data.premium?.yearlyForecast?.[0]
  
  return `施主问起运势，且让清风为你推算。

今年${currentYear}年，你流年行运${yearlyData?.isFavorable ? '尚佳' : '需谨慎'}。
${yearlyData?.summary || '整体运势平稳，宜守不宜进。'}

不过请施主记住，运势就像天气，有晴有雨，但我们可以选择带伞，选择躲避。
好运时莫骄傲，坏运时莫气馁。

**近期运势提示 Fortune Tips：**
- 春季宜谋划，夏季宜行动
- 秋季宜收获，冬季宜静养
- 每月初一、十五焚香祈福，可增善缘

《易经》云："天行健，君子以自强不息。"
运势只是助力，真正决定你人生的，是你自己的选择和努力。
顺境不飘，逆境不馁，平常心是道。`
}

function generateDefaultResponse(message: string, data: Record<string, any>): string {
  const dayMaster = data.analysis?.dayMaster || 'your element'
  
  return `施主这个问题问得好，且让清风为你参详。

你${dayMaster}日主之命，此事当从你的命局整体来看。
凡事皆有因果，今日之果，皆为昨日之因；今日之因，亦为明日之果。

贫道给你的建议是：
- 先静下心来，听自己内心真正的声音
- 凡事三思而后行，冲动是魔鬼
- 多行善事，积累福报，自然逢凶化吉

道家讲究"顺势而为"，但也讲"我命由我不由天"。
这看似矛盾，实则不然——认清自己的命，然后在命的范围内做到最好，
这才是真正的智慧。

若施主还有疑问，尽管问来。清风定当知无不言，言无不尽。`
}

// 真实OpenAI API调用（生产环境使用）
export async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<{ content: string; tokensUsed: number }> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    // Fallback to mock response
    return generateDaoistResponse(
      userMessage,
      'bazi',
      {},
      conversationHistory
    )
  }
  
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ]
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })
    
    const data = await response.json()
    
    return {
      content: data.choices?.[0]?.message?.content || '贫道今日精神不济，请施主改日再来。',
      tokensUsed: data.usage?.total_tokens || 0,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateDaoistResponse(
      userMessage,
      'bazi',
      {},
      conversationHistory
    )
  }
}
