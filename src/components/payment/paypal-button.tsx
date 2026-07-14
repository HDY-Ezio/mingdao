'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, Zap, Shield } from 'lucide-react'

interface PayPalButtonProps {
  amount: number
  currency?: string
  productId: string
  productName: string
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
  variant?: 'gold' | 'outline' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PayPalButton({
  amount,
  currency = 'USD',
  productId,
  productName,
  onSuccess,
  onError,
  variant = 'gold',
  size = 'md',
  className,
}: PayPalButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPayPalLoaded, setIsPayPalLoaded] = React.useState(false)

  // 检查 PayPal SDK 是否已加载
  React.useEffect(() => {
    // MVP期使用mock支付，不加载真实PayPal SDK
    setIsPayPalLoaded(true)
  }, [])

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // MVP期：使用mock支付流程
      // 真实环境：调用 PayPal SDK
      await mockPayPalPayment({
        amount,
        currency,
        productId,
        productName,
      })

      // 模拟支付成功
      const mockOrderId = `MOCK-${Date.now()}`
      onSuccess?.(mockOrderId)
    } catch (error) {
      console.error('Payment error:', error)
      onError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        variant={variant}
        size={size}
        onClick={handlePayment}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay with PayPal · ${amount.toFixed(2)}
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-ink-400">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Instant Access</span>
        </div>
      </div>
    </div>
  )
}

// Mock PayPal payment function for MVP
async function mockPayPalPayment({
  amount,
  productId,
  productName,
}: {
  amount: number
  currency: string
  productId: string
  productName: string
}): Promise<{ success: boolean; orderId: string }> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  // 95% 成功率
  if (Math.random() < 0.05) {
    throw new Error('Payment declined. Please try again.')
  }
  
  return {
    success: true,
    orderId: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }
}

// 派安盈（Payoneer）预留接口
export function PayoneerButton(props: PayPalButtonProps) {
  return (
    <div className="w-full">
      <Button
        variant="outline"
        size={props.size || 'md'}
        disabled
        className={props.className}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Payoneer (Coming Soon)
      </Button>
      <p className="text-[10px] text-ink-400 text-center mt-2">
        派安盈支付即将上线
      </p>
    </div>
  )
}

// 支付模态框
interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  productId: string
  productName: string
  currency?: string
  onSuccess?: (orderId: string) => void
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  productId,
  productName,
  currency = 'USD',
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<'paypal' | 'card'>('paypal')
  const [isProcessing, setIsProcessing] = React.useState(false)

  if (!isOpen) return null

  const handleSuccess = (orderId: string) => {
    setIsProcessing(true)
    onSuccess?.(orderId)
    setTimeout(() => {
      onClose()
      setIsProcessing(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-ink-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-ink-100">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-ink-900">
              Complete Your Purchase
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ink-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order summary */}
          <div className="bg-ink-50/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-ink-600">{productName}</span>
              <span className="font-semibold text-ink-900">${amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Currency</span>
              <span className="text-ink-600">{currency}</span>
            </div>
            <div className="border-t border-ink-200 mt-3 pt-3 flex items-center justify-between">
              <span className="font-medium text-ink-900">Total</span>
              <span className="font-serif text-xl font-bold text-ink-900">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-ink-700">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  paymentMethod === 'paypal'
                    ? 'border-gold-400 bg-gold-50'
                    : 'border-ink-200 hover:border-ink-300'
                }`}
              >
                <div className="text-sm font-semibold text-ink-800">PayPal</div>
                <div className="text-xs text-ink-500 mt-0.5">Most popular</div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  paymentMethod === 'card'
                    ? 'border-gold-400 bg-gold-50'
                    : 'border-ink-200 hover:border-ink-300'
                }`}
              >
                <div className="text-sm font-semibold text-ink-800">Card</div>
                <div className="text-xs text-ink-500 mt-0.5">Credit/Debit</div>
              </button>
            </div>
          </div>

          {/* Pay button */}
          {isProcessing ? (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-ink-600">Processing payment...</p>
            </div>
          ) : (
            <PayPalButton
              amount={amount}
              currency={currency}
              productId={productId}
              productName={productName}
              onSuccess={handleSuccess}
              variant="gold"
              size="lg"
              className="w-full h-14"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-[11px] text-ink-400 text-center">
            By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            <br />
            完成支付即表示您同意我们的服务条款和隐私政策。
          </p>
        </div>
      </div>
    </div>
  )
}
