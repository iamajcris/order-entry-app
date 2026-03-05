import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader2, ArrowLeft, Printer } from 'lucide-react'
import { ordersApi } from '@/lib/api'
import { formatPeso } from '@/lib/utils'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: Boolean(id),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-red-400 text-sm">
        {(error as Error | null)?.message ?? 'Order not found'}
      </div>
    )
  }

  const items = [
      {
      "name": "1/2 Rice",
      "category": "Misc",
      "pricing": [
          {
              "size": "Regular",
              "price": 8
          }
      ]
  }
  ];// order.items ?? order.order_items ?? []
  const customer = order.customer

  return (
    <div>
      {/* Back + header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft size={13} />
            Back
          </button>
          <h1 className="text-lg font-semibold text-slate-800">Order #{order.id}</h1>
          <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
            {order.order_date}
          </span>
        </div>
        {order.receipt_url && (
          <a
            href={order.receipt_url}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs"
          >
            <Printer size={13} />
            Print Receipt
          </a>
        )}
      </div>

      <div className="space-y-4">
        {/* Customer */}
        <Card>
          <CardHeader title="Customer" />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Name</p>
                <p className="font-medium">
                  {customer?.first_name ? (
                    `${customer.first_name} ${customer.last_name ?? ''}`
                  ) : (
                    <span className="text-slate-400 italic">Walk-in</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Mobile</p>
                <p className="font-mono">{customer?.mobile ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Mobile</p>
                <p className="font-mono">{customer?.mobile ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Delivery Type</p>
                <p className="capitalize">{customer?.delivery_type?.replace(/_/g, ' ') ?? '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400 mb-0.5">Delivery Address</p>
                <p>
                  {[customer?.street, customer?.barangay, customer?.city, customer?.province]
                    .filter(Boolean).join(', ') || '—'}
                </p>
                {customer?.landmark && (
                  <p className="text-xs text-slate-400 mt-0.5">📍 {customer.landmark}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader title="Items" />
          <div>
            {items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-5 py-3 border-b border-slate-100 last:border-0 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    xxx × xxx
                  </p>
                </div>
                <span className="font-mono font-semibold text-slate-800">
                  xxx
                </span>
              </div>
            ))}

            <div className="px-5 py-3 space-y-1 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Sub Total</span>
                <span className="font-mono">{formatPeso(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-800">
                <span>Total</span>
                <span className="font-mono">{formatPeso(order.total)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader title="Payment" />
          <CardBody>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Method</p>
                <p className="capitalize font-medium">{order.payment_method ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Amount Tendered</p>
                <p className="font-mono font-medium">{formatPeso(order.amount_tendered)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Change</p>
                <p className="font-mono font-medium text-green-600">
                  {formatPeso(order.change_amount)}
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-0.5">Notes</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
