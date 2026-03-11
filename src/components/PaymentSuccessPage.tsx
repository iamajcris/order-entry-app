import { CheckCircle2, QrCode } from 'lucide-react'
import type { Order } from '@/types'
import { formatPeso } from '@/lib/utils'

interface PaymentSuccessPageProps {
  order: Order
  onNewOrder: () => void
  onViewOrder: () => void
}

const PAYMENT_INSTRUCTIONS = {
  gcash: {
    title: 'GCash',
    instructions: [
      'Open your GCash app',
      'Go to "Send Money" or "Pay Bills"',
      'Scan the QR code or enter merchant details',
      'Enter the amount and confirm',
      'Take a screenshot of the confirmation',
    ],
    qrPlaceholder: true,
  },
  maya: {
    title: 'Maya (formerly Paymaya)',
    instructions: [
      'Open your Maya app',
      'Tap "Pay" or "Scan QR"',
      'Scan the QR code below',
      'Confirm payment details',
      'Complete the transaction',
    ],
    qrPlaceholder: true,
  },
  bank_transfer: {
    title: 'Bank Transfer',
    instructions: [
      'Log in to your bank\'s mobile or online app',
      'Select "Fund Transfer" or "Send Money"',
      'Enter the account details shown below',
      'Enter the amount and confirm',
      'Save or screenshot the reference number',
    ],
    qrPlaceholder: false,
  },
  cash: {
    title: 'Cash Payment',
    instructions: [
      'Please prepare the exact or nearest amount',
      'Payment will be collected upon delivery or pickup',
      'Please have your ID ready for verification',
      'A receipt will be provided after payment',
    ],
    qrPlaceholder: false,
  },
}

export default function PaymentSuccessPage({
  order,
  onNewOrder,
  onViewOrder,
}: PaymentSuccessPageProps) {
  const paymentMethod = order.payment_method as keyof typeof PAYMENT_INSTRUCTIONS
  const paymentInfo = PAYMENT_INSTRUCTIONS[paymentMethod] || PAYMENT_INSTRUCTIONS.cash

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600 mb-1">Order #{order.id}</p>
          <p className="text-sm text-slate-500">
            {new Date(order.created_at || new Date()).toLocaleDateString('en-PH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="card mb-6">
          <div className="card-header">
            <h2>Order Summary</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Order Total:</span>
              <span className="font-semibold text-slate-900">{formatPeso(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Tendered:</span>
              <span className="font-semibold text-slate-900">
                {formatPeso(order.amount_tendered)}
              </span>
            </div>
            {order.change_amount > 0 && (
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Change:</span>
                <span className="font-semibold text-green-600">
                  {formatPeso(order.change_amount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Instructions Card */}
        <div className="card mb-6">
          <div className="card-header bg-blue-50 border-b border-blue-100">
            <h2 className="flex items-center gap-2 text-blue-900">
              <span className="text-lg">💳</span>
              {paymentInfo.title} Payment Instructions
            </h2>
          </div>

          <div className="px-5 py-6 space-y-6">
            {/* Instructions List */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Steps to Complete Payment:</h3>
              <ol className="space-y-3">
                {paymentInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* QR Code Placeholder */}
            {paymentInfo.qrPlaceholder && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8">
                <div className="flex flex-col items-center gap-3">
                  <QrCode size={48} className="text-slate-400" />
                  <div className="text-center">
                    <p className="font-semibold text-slate-700">QR Code Placeholder</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {paymentMethod === 'gcash'
                        ? 'GCash Merchant QR Code'
                        : 'Payment Provider QR Code'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Details Placeholder */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bank Name:</span>
                    <span className="font-semibold text-slate-900">[Bank Name Here]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Account Name:</span>
                    <span className="font-semibold text-slate-900">[Account Name Here]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Account Number:</span>
                    <span className="font-mono font-semibold text-slate-900">[Account Number]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reference:</span>
                    <span className="font-mono font-semibold text-slate-900">Order #{order.id}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">⚠️ Important:</span> Please send proof of payment
                (screenshot or reference number) to confirm your order. Your order will be
                processed once payment is verified.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button className="btn-secondary" onClick={onViewOrder}>
            View Order Details
          </button>
          <button className="btn-primary" onClick={onNewOrder}>
            Create New Order
          </button>
        </div>
      </div>
    </div>
  )
}
