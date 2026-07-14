import { NextResponse } from 'next/server'

// POST /api/paypal/create-order
// 创建 PayPal 订单
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      productId, 
      amount, 
      currency = 'USD',
      productName,
      userId,
    } = body

    if (!productId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: productId and amount' },
        { status: 400 }
      )
    }

    // MVP期：使用mock订单创建
    // 真实环境：调用 PayPal Orders API
    // const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`,
    //   },
    //   body: JSON.stringify({
    //     intent: 'CAPTURE',
    //     purchase_units: [{
    //       amount: {
    //         currency_code: currency,
    //         value: amount.toString(),
    //       },
    //       description: productName,
    //       custom_id: productId,
    //     }],
    //   }),
    // })

    // 模拟 PayPal 订单创建
    const mockOrderId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // TODO: 保存订单到数据库
    // const supabase = createClient()
    // await supabase.from('paypal_orders').insert({
    //   paypal_order_id: mockOrderId,
    //   user_id: userId,
    //   product_id: productId,
    //   amount,
    //   currency,
    //   order_type: 'report',
    //   status: 'created',
    // })

    return NextResponse.json({
      orderId: mockOrderId,
      status: 'CREATED',
      amount,
      currency,
      productId,
      productName,
      // 真实 PayPal 会返回 approveUrl 等信息
      approveUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`,
    })
  } catch (error) {
    console.error('PayPal create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
