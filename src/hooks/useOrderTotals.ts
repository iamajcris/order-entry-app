import { useMemo } from 'react'
import type { OrderItemFormValues } from '@/types'

interface OrderTotals {
  subtotal: number
  total: number
  change: number
}

/**
 * Computes order totals from watched form values.
 */
export function useOrderTotals(
  items: Partial<OrderItemFormValues>[] = [],
  amountTendered: number = 0
): OrderTotals {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(String(item?.quantity ?? 0)) || 0
      const price = parseFloat(String(item?.unit_price ?? 0)) || 0
      return sum + qty * price
    }, 0)

    const total = subtotal // extend here for discounts / tax
    const change = Math.max(0, (parseFloat(String(amountTendered)) || 0) - total)

    return { subtotal, total, change }
  }, [items, amountTendered])
}
