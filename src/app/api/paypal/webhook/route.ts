import { NextResponse } from 'next/server'

// POST /api/paypal/webhook
// PayPal Webhook - 处理支付事件通知
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const eventType = body.event_type
    
    console.log('PayPal webhook received:', eventType)

    // 验证 webhook 签名（生产环境必须）
    // const verifyResult = await verifyWebhookSignature(request, body)
    // if (!verifyResult) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    // 处理不同类型的事件
    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        // 订单已批准
        await handleOrderApproved(body)
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        // 支付完成
        await handleCaptureCompleted(body)
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        // 退款
        await handleRefunded(body)
        break

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // 订阅激活
        await handleSubscriptionActivated(body)
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // 订阅取消
        await handleSubscriptionCancelled(body)
        break

      default:
        console.log('Unhandled PayPal event:', eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleOrderApproved(body: any) {
  const orderId = body.resource?.id
  console.log('Order approved:', orderId)
  // TODO: 更新订单状态为 approved
}

async function handleCaptureCompleted(body: any) {
  const captureId = body.resource?.id
  const amount = body.resource?.amount?.value
  const customId = body.resource?.custom_id
  
  console.log('Capture completed:', captureId, 'Amount:', amount)
  
  // TODO: 
  // 1. 更新订单状态为 completed
  // 2. 创建报告记录
  // 3. 发送确认邮件
  // 4. 更新用户订阅/积分等
}

async function handleRefunded(body: any) {
  console.log('Payment refunded:', body.resource?.id)
  // TODO: 处理退款
}

async function handleSubscriptionActivated(body: any) {
  console.log('Subscription activated:', body.resource?.id)
  // TODO: 更新用户订阅状态
}

async function handleSubscriptionCancelled(body: any) {
  console.log('Subscription cancelled:', body.resource?.id)
  // TODO: 更新用户订阅状态
}
