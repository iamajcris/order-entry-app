// ─────────────────────────────────────────
//  Domain Types
// ─────────────────────────────────────────

export type DeliveryType = 'delivery' | 'pick_up'

export interface Customer {
  id: number
  contactId: string
  firstName: string
  lastName: string
  mobileNumber: string
  deliveryType?: DeliveryType
  street: string
  barangay: string
  city: string
  landmark?: string
  preferredDeliveryTime?: string
  preferredPickupTime?: string
  pickupNotes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id?: number
  order_id?: number
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

export type PaymentMethod = 'cash' | 'gcash' | 'card' | 'bank_transfer'

export interface Order {
  id: number
  customer_id: number | null
  customer?: Customer
  order_date: string
  order_time?: string
  subtotal: number
  total: number
  payment_method: PaymentMethod
  amount_tendered: number
  change_amount: number
  notes?: string
  receipt_url?: string
  items?: OrderItem[]
  order_items?: OrderItem[]
  created_at?: string
}

// ─────────────────────────────────────────
//  API Response wrappers
// ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total?: number
  page?: number
  per_page?: number
}

// ─────────────────────────────────────────
//  Form Types (match Zod schemas in schemas.ts)
// ─────────────────────────────────────────

export type CustomerMode = 'search' | 'manual'

export interface CustomerFormValues {
  mode: CustomerMode
  customer_id: number | null
  first_name: string
  last_name: string
  mobile: string
  delivery_type: DeliveryType
  // Address
  street: string
  barangay: string
  city: string
  province: string
  landmark: string
  pickup_time: string
  pickup_notes: string
}

export interface OrderItemFormValues {
  description: string
  quantity: number
  unit_price: number
}

export interface PaymentFormValues {
  method: PaymentMethod
  amount_tendered: number
}

export interface OrderFormValues {
  customer: CustomerFormValues
  order_date: string
  order_time: string
  notes: string
  items: OrderItemFormValues[]
  payment: PaymentFormValues
  print_receipt: boolean
}

// ─────────────────────────────────────────
//  API Request Payloads
// ─────────────────────────────────────────

export interface CreateCustomerPayload {
  first_name: string
  last_name: string
  mobile: string
  delivery_type: DeliveryType
  street: string
  barangay: string
  city: string
  province: string
  landmark?: string
}

export interface CreateOrderItemPayload {
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface CreateOrderPayload {
  customer_id: number | null
  customer: CreateCustomerPayload
  order_date: string
  order_time: string
  notes: string
  items: CreateOrderItemPayload[]
  payment_method: PaymentMethod
  amount_tendered: number
  print_receipt: boolean
}

export interface MenuItem {
  name: string
  category: string
  pricing: {
    size: string
    price: number
  }[]
}

export interface Menu {
  id: string
  menuId: string
  store: string
  menuItems: MenuItem[]
}

export interface TypeOption {
  id: string
  text: string
  ext: Record<string, any>
}

// ─────────────────────────────────────────
//  API Response Types
// ─────────────────────────────────────────

export interface ApiErrorResponse {
  message?: string
  error?: string
}

// ─────────────────────────────────────────
//  Other Types
// ─────────────────────────────────────────  