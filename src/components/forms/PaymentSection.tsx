import { useFormContext } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { formatPeso } from '@/lib/utils'
import { useOrderTotals } from '@/hooks/useOrderTotals'
import { cn } from '@/lib/utils'
import type { OrderSchema } from '@/lib/schemas'
import type { PaymentMethod } from '@/types'

interface PaymentOption {
  value: PaymentMethod
  label: string
}

const PAYMENT_METHODS: PaymentOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'gcash', label: 'GCash' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

interface PaymentSectionProps {
  isSubmitting: boolean
}

export default function PaymentSection({ isSubmitting }: PaymentSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<OrderSchema>()

  const watchedItems = watch('items')
  const amountTendered = watch('payment.amount_tendered')
  const { total, change } = useOrderTotals(watchedItems, amountTendered)

  return (
    <Card>
      <CardHeader title="Payment details" />

      <CardBody className="space-y-4">
        {/* Method + Amount row */}
        <div className="flex gap-3 items-end">
          {/* Method dropdown */}
          <div className="relative w-36">
            <select
              className="input appearance-none pr-8 font-medium"
              {...register('payment.method')}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Amount tendered */}
          <div className="flex-1">
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md text-slate-500 text-sm">
                ₱
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                className={cn(
                  'input rounded-l-none',
                  errors?.payment?.amount_tendered && 'input-error'
                )}
                placeholder="0"
                {...register('payment.amount_tendered', { valueAsNumber: true })}
              />
            </div>
            {errors?.payment?.amount_tendered && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.payment.amount_tendered.message}
              </p>
            )}
          </div>
        </div>

        {/* Change */}
        <div className="flex justify-between items-center py-2 border-t border-slate-100">
          <span className="text-sm text-slate-500">Change</span>
          <span
            className={cn(
              'font-mono font-semibold text-sm',
              change > 0 ? 'text-green-600' : 'text-slate-700'
            )}
          >
            {formatPeso(change)}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-2 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Booking…
            </>
          ) : (
            'Book Order'
          )}
        </button>
      </CardBody>
    </Card>
  )
}
