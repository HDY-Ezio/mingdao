import { NextResponse } from 'next/server'

// POST /api/paypal/capture-order
// 捕获 PayPal 订单（完成支付）
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, paypalOrderId } = body

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: 'Missing paypalOrderId' },
        { status: 400 }
      )
    }

    // MVP期：使用mock支付捕获
    // 真实环境：调用 PayPal Orders Capture API
    // const response = await fetch(
    //   `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${accessToken}`,
    //     },
    //   }
    // )

    // 模拟支付成功
    const mockCaptureId = `CAP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // TODO: 更新订单状态
    // TODO: 创建报告记录
    // TODO: 更新用户问道次数

    return NextResponse.json({
      success: true,
      status: 'COMPLETED',
      captureId: mockCaptureId,
      orderId: orderId || mockCaptureId,
      // 真实 PayPal 会返回更多详情
      payer: {
        email: 'payer@example.com',
        name: 'Test User',
      },
    })
  } catch (error) {
    console.error('PayPal capture order error:', error)
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    )
  }
}
