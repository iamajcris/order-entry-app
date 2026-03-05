import axios from 'axios'
import type {
  Customer,
  Order,
  CreateCustomerPayload,
  CreateOrderPayload,
  PaginatedResponse,
  Menu,
} from '@/types'

// ─────────────────────────────────────────
//  Base client
//  👇 Change VITE_API_URL in your .env file
// ─────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Unwrap response data and normalize errors
apiClient.interceptors.response.use(
  (res) => res.data,
  (err: unknown) => {
    let message = 'Something went wrong'
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined
      message =
        (data?.message as string) ??
        (data?.error as string) ??
        err.message
    }
    return Promise.reject(new Error(message))
  }
)

// ─────────────────────────────────────────
//  Customers
// ─────────────────────────────────────────
export const customersApi = {
  /** Search customers by name or mobile */
  search: (q: string): Promise<Customer[]> =>
    apiClient.get('/customers', { params: { q } }),

  /** Get a single customer */
  getById: (id: number): Promise<Customer> =>
    apiClient.get(`/customers/${id}`),

  /** Create a new customer */
  create: (data: CreateCustomerPayload): Promise<Customer> =>
    apiClient.post('/customers', data),
  getByContactId: (contactId: string): Promise<Customer> =>
    apiClient.get(`/customer/by-contact/${contactId}`),
}

// ─────────────────────────────────────────
//  Orders
// ─────────────────────────────────────────
export interface OrderListParams {
  page?: number
  per_page?: number
  date?: string
  customer_id?: number
}

export const ordersApi = {
  /** List all orders with optional filters */
  list: (params?: OrderListParams): Promise<Order[] | PaginatedResponse<Order>> =>
    apiClient.get('/orders', { params }),

  /** Get a single order with its items */
  getById: (id: number | string): Promise<Order> =>
    apiClient.get(`/orders/${id}`),

  /**
   * Create a new order.
   * Returns the created order — may include receipt_url if print was requested.
   */
  create: (data: CreateOrderPayload): Promise<Order> =>
    apiClient.post('/orders', data),

  /** Update order status (e.g. void) */
  updateStatus: (id: number, status: string): Promise<Order> =>
    apiClient.patch(`/orders/${id}`, { status }),
}

export const menuApi = {
  getLatestMenu: (): Promise<Menu> =>
    apiClient.get('/menu/latest'),
}