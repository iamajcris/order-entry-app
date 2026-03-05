import { useFormContext } from 'react-hook-form'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { formatPeso } from '@/lib/utils'
import { useOrderTotals } from '@/hooks/useOrderTotals'
import { cn } from '@/lib/utils'
import { MENU_ITEMS, CATEGORY_COLORS } from '@/data/menuItems'
import type { OrderSchema } from '@/lib/schemas'
import { useFieldArray } from 'react-hook-form'

// ── Category emoji map (mirrors OrderItemsSection) ────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
  Misc:    '🍚',
  Pork:    '🥩',
  Fish:    '🐟',
  Beef:    '🥩',
  Chicken: '🍗',
  Veg:     '🥦',
}

export default function OrderSummary() {
  const { watch, control } = useFormContext<OrderSchema>()
  const { remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = watch('items')
  const { subtotal, total } = useOrderTotals(watchedItems)

  const hasItems = watchedItems && watchedItems.length > 0
  const totalQty = watchedItems?.reduce((s, i) => s + (Number(i?.quantity) || 0), 0) ?? 0

  return (
    <Card>
      <CardHeader
        title="Order Summary"
        actions={
          hasItems ? (
            <span className="text-xs font-semibold bg-brand-600 text-white px-2 py-0.5 rounded-full">
              {totalQty} {totalQty === 1 ? 'item' : 'items'}
            </span>
          ) : undefined
        }
      />

      {/* Empty state */}
      {!hasItems && (
        <CardBody>
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
            <ShoppingCart size={32} strokeWidth={1.5} />
            <p className="text-sm">No items added yet</p>
            <p className="text-xs text-slate-300">Select items from the menu above</p>
          </div>
        </CardBody>
      )}

      {/* Item rows */}
      {hasItems && (
        <>
          <div>
            {watchedItems.map((item, index) => {
              const menuEntry = MENU_ITEMS.find(m => m.name === item.description)
              const emoji    = menuEntry ? (CATEGORY_EMOJI[menuEntry.category] ?? '🍽️') : '🍽️'
              const colorCls = menuEntry ? (CATEGORY_COLORS[menuEntry.category] ?? 'bg-slate-100 text-slate-600') : 'bg-slate-100 text-slate-600'
              const qty      = Number(item.quantity) || 0
              const price    = Number(item.unit_price) || 0
              const lineTotal = qty * price

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 last:border-0 group"
                >
                  {/* Emoji */}
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0 select-none">
                    {emoji}
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.description}
                    </p>
                    {menuEntry && (
                      <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', colorCls)}>
                        {menuEntry.category}
                      </span>
                    )}
                  </div>

                  {/* Qty × price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-800 tabular-nums">
                      {formatPeso(lineTotal)}
                    </p>
                    <p className="text-xs text-slate-400 tabular-nums">
                      {qty} × {formatPeso(price)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${item.description}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 shrink-0 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Totals footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatPeso(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">Total</span>
              <span className="text-base font-bold text-brand-600 font-mono">
                {formatPeso(total)}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}