import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import CustomerSection from '@/components/forms/CustomerSection'
import OrderItemsSection from '@/components/forms/OrderItemsSection'
import PaymentSection from '@/components/forms/PaymentSection'
import PaymentSuccessPage from '@/components/PaymentSuccessPage'
import { orderSchema, type OrderSchema } from '@/lib/schemas'
import { ordersApi, customersApi } from '@/lib/api'
import { today, currentTime } from '@/lib/utils'
import type { Order } from '@/types'
import OrderSummary from '@/components/forms/OrderSummary'

const defaultValues: OrderSchema = {
  customer: {
    first_name: '',
    last_name: '',
    delivery_type: 'delivery',
    street: '',
    barangay: '',
    city: '',
    cityCode: '0402109000',
    landmark: '',
    mobile: '',
    barangayCode: '',
    delivery_time: '',
    pickup_time: '',
    pickup_notes: '',
  },
  order_date: today(),
  order_time: currentTime(),
  notes: '',
  items: [],
  payment: {
    method: 'cash',
  },
  print_receipt: true,
}

export default function AddOrderPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [successOrder, setSuccessOrder] = useState<Order | null>(null)

  const methods = useForm<OrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: OrderSchema): Promise<Order> => {
      // 1. Optionally save customer first
      // let customerId = data.customer.customer_id ?? null

      // if (!customerId && data.customer.first_name) {
      //   const saved = await customersApi.create({
      //     first_name: data.customer.first_name,
      //     last_name: data.customer.last_name ?? '',
      //     mobile: data.customer.mobile ?? '',
      //     delivery_type: data.customer.delivery_type,
      //     street: data.customer.street ?? '',
      //     barangay: data.customer.barangay ?? '',
      //     city: data.customer.city ?? '',
      //     landmark: data.customer.landmark ?? '',
      //     province: 'Metro Manila', // Default province since we're only servicing Metro Manila
      //   })
      //   customerId = saved.id
      // }

      // // 2. Build and submit order payload
      // return ordersApi.create({
      //   customer_id: customerId,
      //   customer: {
      //     first_name: data.customer.first_name,
      //     last_name: data.customer.last_name ?? '',
      //     mobile: data.customer.mobile ?? '',
      //     delivery_type: data.customer.delivery_type,
      //     street: data.customer.street ?? '',
      //     barangay: data.customer.barangay ?? '',
      //     city: data.customer.city ?? '',
      //     landmark: data.customer.landmark ?? '',
      //     province: 'Metro Manila', // Default province since we're only servicing Metro Manila
      //   },
      //   order_date: data.order_date,
      //   order_time: data.order_time ?? '',
      //   notes: data.notes ?? '',
      //   items: data.items.map((item) => ({
      //     description: item.description,
      //     quantity: item.quantity,
      //     unit_price: item.unit_price,
      //     line_total: item.quantity * item.unit_price,
      //   })),
      //   payment_method: data.payment.method,
      //   print_receipt: data.print_receipt
      // })
    },
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      setSuccessOrder(result)
      // Open receipt PDF in a new tab if URL returned
      // if (result.receipt_url) {
      //   window.open(result.receipt_url, '_blank')
      // }
    },
  })

  async function onSubmit(data: OrderSchema) {
    try {
      console.log('Submitting order:', data)
      await mutateAsync(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      alert(`Error: ${message}`)
    }
  }

  // ── Success state ──────────────────────────────────────
  if (successOrder) {
    return (
      <PaymentSuccessPage
        order={successOrder}
        onViewOrder={() => navigate(`/orders/${successOrder.id}`)}
        onNewOrder={() => {
          setSuccessOrder(null)
          methods.reset(defaultValues)
        }}
      />
    )
  }

  // ── Form ──────────────────────────────────────────────
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-800 mb-5">Add Order</h1>

      <FormProvider {...methods}>
        <form 
          onSubmit={methods.handleSubmit(
            onSubmit,
            (errors) => console.log('form validation failed', errors)
          )}
          className="space-y-4" noValidate>
          <CustomerSection />
          <OrderItemsSection />
          <OrderSummary />
          <PaymentSection isSubmitting={isPending} />
        </form>
      </FormProvider>
    </div>
  )
}