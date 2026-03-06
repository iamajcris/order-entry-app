import { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Minus } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { formatPeso, generateTimeOptions } from '@/lib/utils'
import { useOrderTotals } from '@/hooks/useOrderTotals'
import { cn } from '@/lib/utils'
import { MENU_ITEMS, CATEGORIES, CATEGORY_COLORS } from '@/data/menuItems'
import type { OrderSchema } from '@/lib/schemas'
import type { MenuItem } from '@/data/menuItems'
import { menuApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

// ── Category emoji map ────────────────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
  Misc:    '🍚',
  Pork:    '🥩',
  Fish:    '🐟',
  Beef:    '🥩',
  Chicken: '🍗',
  Veg:     '🥦',
}

// ── Quantity Stepper  (− n +) ─────────────────────────────────────────────────
interface StepperProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

function QuantityStepper({ quantity, onIncrement, onDecrement }: StepperProps) {
  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm">
      <button
        type="button"
        onClick={onDecrement}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors"
        aria-label="Decrease"
      >
        <Minus size={13} />
      </button>
      <span className="w-8 text-center font-semibold text-slate-700 tabular-nums select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors"
        aria-label="Increase"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

// ── Menu Item Card ────────────────────────────────────────────────────────────
interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onDecrement: () => void
}

function MenuItemCard({ item, quantity, onAdd, onIncrement, onDecrement }: MenuItemCardProps) {
  const price = item.pricing[0].price
  const isAdded = quantity > 0
  const emoji = CATEGORY_EMOJI[item.category] ?? '🍽️'
  const colorClass = CATEGORY_COLORS[item.category] ?? 'bg-slate-100 text-slate-600'

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 transition-colors',
      isAdded && 'bg-blue-50/50'
    )}>
      {/* Emoji thumbnail */}
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl shrink-0 select-none">
        {emoji}
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          isAdded ? 'text-slate-800' : 'text-slate-700'
        )}>
          {item.name}
        </p>
        <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', colorClass)}>
          {item.category}
        </span>
      </div>

      {/* Price */}
      <span className="text-sm font-semibold text-slate-700 tabular-nums shrink-0">
        {formatPeso(price)}
      </span>

      {/* Add button or stepper */}
      <div className="shrink-0">
        {isAdded ? (
          <QuantityStepper
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 active:scale-95 transition-all shadow-sm"
            aria-label={`Add ${item.name}`}
          >
            <Plus size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OrderItemsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<OrderSchema>()

  const { fields, append, remove, update } = useFieldArray({ control, name: 'items' })
  const watchedItems = watch('items')
  const { subtotal, total } = useOrderTotals(watchedItems)

  // ── helpers ──────────────────────────────────────────────────────────────
  function getFieldIndex(menuItem: MenuItem): number {
    return fields.findIndex(f => f.description === menuItem.name)
  }

  function getQuantity(menuItem: MenuItem): number {
    const idx = getFieldIndex(menuItem)
    if (idx === -1) return 0
    return Number(watchedItems?.[idx]?.quantity ?? 0)
  }

  function handleAdd(menuItem: MenuItem) {
    append({
      description: menuItem.name,
      quantity: 1,
      unit_price: menuItem.pricing[0].price,
    })
  }

  function handleIncrement(menuItem: MenuItem) {
    const idx = getFieldIndex(menuItem)
    if (idx === -1) return
    const current = Number(watchedItems?.[idx]?.quantity ?? 1)
    update(idx, {
      description: menuItem.name,
      quantity: current + 1,
      unit_price: menuItem.pricing[0].price,
    })
  }

  function handleDecrement(menuItem: MenuItem) {
    const idx = getFieldIndex(menuItem)
    if (idx === -1) return
    const current = Number(watchedItems?.[idx]?.quantity ?? 1)
    if (current <= 1) {
      remove(idx)
    } else {
      update(idx, {
        description: menuItem.name,
        quantity: current - 1,
        unit_price: menuItem.pricing[0].price,
      })
    }
  }

  const { data: latestMenu, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuApi.getLatestMenu(),
  });

  useEffect(() => {
    if (latestMenu?.menuItems) {
      setMenuItems(latestMenu.menuItems);
    }
  }, [latestMenu]); 

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="text-slate-400">Loading menu...</span>
      </div>
    );
  }
  
  // Total items added (for badge)
  const totalItemCount = watchedItems?.reduce((sum, i) => sum + (Number(i?.quantity) || 0), 0) ?? 0

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory)

  return (
    <Card>
      <CardHeader
        title="Order Details"
        actions={
          totalItemCount > 0 ? (
            <span className="text-xs font-semibold bg-brand-600 text-white px-2 py-0.5 rounded-full">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          ) : undefined
        }
      />

      <CardBody className="space-y-5">

        {/* Date / Time / Notes */}
        {/* <div className="grid grid-cols-3 gap-4">
          <FormField label="Order Date" error={errors?.order_date?.message}>
            <input
              type="date"
              className={cn('input', errors?.order_date && 'input-error')}
              {...register('order_date')}
            />
          </FormField>
          <FormField label="Time">
            <select className="input" {...register('order_time')}>
              <option value="">-- Select time --</option>
              {timeOptions.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Notes">
            <input
              className="input"
              placeholder="Optional notes…"
              {...register('notes')}
            />
          </FormField>
        </div> */}

        {/* Array-level validation error */}
        {/* {typeof errors?.items?.message === 'string' && (
          <p className="text-xs text-red-500 -mt-2">{errors.items.message}</p>
        )} */}

        {/* ── Menu section ────────────────────────────────────────── */}
        <div className="-mx-4 -mb-4">

          {/* Category filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All'
                ? watchedItems?.length ?? 0
                : watchedItems?.filter(i =>
                    MENU_ITEMS.find(m => m.name === i.description)?.category === cat
                  ).length ?? 0

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                    activeCategory === cat
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  )}
                >
                  {cat}
                  {count > 0 && (
                    <span className={cn(
                      'text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold',
                      activeCategory === cat ? 'bg-white/30 text-white' : 'bg-brand-100 text-brand-700'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Menu item list */}
          <div className="border-t border-slate-100">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.name}
                item={item}
                quantity={getQuantity(item)}
                onAdd={() => handleAdd(item)}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
              />
            ))}
          </div>

        </div>

      </CardBody>

      {/* Summary — sticky at bottom of card */}
      {totalItemCount > 0 && (
        <div className="border-t border-slate-200 px-5 py-4 space-y-1 bg-slate-50">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Sub Total</span>
            <span className="font-mono">{formatPeso(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-slate-800">
            <span>Total</span>
            <span className="font-mono">{formatPeso(total)}</span>
          </div>
        </div>
      )}
    </Card>
  )
}