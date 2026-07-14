import { NextResponse } from 'next/server'
import { calculateBazi } from '@/lib/bazi-calculator'
import { generateReport } from '@/lib/report-generator'
import type { ReportType, BaziInput } from '@/types'

// POST /api/reports/generate
// 生成报告
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      reportType,
      inputData,
      userId,
    } = body

    if (!reportType) {
      return NextResponse.json(
        { error: 'Missing reportType' },
        { status: 400 }
      )
    }

    let reportData: Record<string, any> = {}

    // 根据报告类型生成不同的报告
    switch (reportType as ReportType) {
      case 'bazi':
      case 'relationship':
      case 'career': {
        const { name, gender, birthDate, birthPlace, longitude } = inputData
        const date = new Date(birthDate)
        
        const baziResult = calculateBazi({
          name,
          gender,
          birthDate: date,
          birthPlace,
          longitude: longitude || 120,
        })
        
        reportData = generateReport(reportType as ReportType, {}, baziResult)
        break
      }

      case 'ziwei': {
        reportData = generateReport('ziwei', inputData)
        break
      }

      case 'iching': {
        reportData = generateReport('iching', inputData)
        break
      }

      case 'compatibility': {
        const { personA, personB } = inputData
        const dateA = new Date(personA.birthDate)
        const dateB = new Date(personB.birthDate)
        
        const baziA = calculateBazi({
          name: personA.name,
          gender: personA.gender,
          birthDate: dateA,
          birthPlace: personA.birthPlace,
          longitude: 120,
        })
        
        const baziB = calculateBazi({
          name: personB.name,
          gender: personB.gender,
          birthDate: dateB,
          birthPlace: personB.birthPlace,
          longitude: 120,
        })
        
        reportData = generateReport('compatibility', { reading1: baziA, reading2: baziB })
        break
      }

      default:
        return NextResponse.json(
          { error: `Unsupported report type: ${reportType}` },
          { status: 400 }
        )
    }

    // TODO: 保存报告到数据库
    // const supabase = createClient()
    // const { data: report } = await supabase.from('reports').insert({
    //   user_id: userId,
    //   product_id: inputData.productId,
    //   title: reportData.basic?.name ? `${reportData.basic.name}'s Report` : 'Report',
    //   report_type: reportType,
    //   input_data: inputData,
    //   report_data: reportData,
    //   questions_total: inputData.baseQuestions || 10,
    //   status: 'ready',
    // }).select().single()

    return NextResponse.json({
      success: true,
      report: reportData,
      // reportId: report?.id,
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

// GET /api/reports
// 获取用户的报告列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  // TODO: 从数据库获取用户报告
  // const supabase = createClient()
  // const { data: reports, count } = await supabase
  //   .from('reports')
  //   .select('*', { count: 'exact' })
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .range(offset, offset + limit - 1)

  return NextResponse.json({
    reports: [],
    total: 0,
    limit,
    offset,
  })
}
