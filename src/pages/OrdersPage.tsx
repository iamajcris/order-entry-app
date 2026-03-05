import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { ordersApi } from '@/lib/api'
import { formatPeso } from '@/lib/utils'
import type { Order, PaginatedResponse } from '@/types'

function normalizeOrders(data: Order[] | PaginatedResponse<Order> | undefined): Order[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  return data.data ?? []
}

export default function OrdersPage() {
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list(),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16 text-slate-500 gap-2">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    )
  }

  const orders = normalizeOrders(data)

  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-5">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">No orders yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">#</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Customer</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Date</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Payment</th>
                <th className="text-right px-5 py-3 font-medium text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-5 py-3 font-mono text-slate-400 text-xs">{order.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {order.customer?.first_name ? (
                      `${order.customer.first_name} ${order.customer.last_name ?? ''}`
                    ) : (
                      <span className="text-slate-400 italic">Walk-in</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{order.order_date}</td>
                  <td className="px-5 py-3">
                    <span className="capitalize text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {order.payment_method ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-slate-800">
                    {formatPeso(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
