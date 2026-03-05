import { z } from 'zod'

export enum DeliveryType {
  DELIVERY = 'delivery',
  PICK_UP = 'pick_up',
};

export const DELIVERY_TYPES = [
  { id: DeliveryType.DELIVERY, label: 'Delivery' },
  { id: DeliveryType.PICK_UP, label: 'Pick Up' },
] as const


export const customerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional().default(''),
  mobile: z
    .string()
    .regex(/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid mobile number')
    .optional()
    .or(z.literal('')),
  delivery_type: z
    .string()
    .optional()
    .default(DeliveryType.DELIVERY),
  street: z.string().optional().default(''),
  barangay: z.string().optional().default(''),
  city: z.string().optional().default(''),
  landmark: z.string().optional().default(''),
  pickup_time: z.string().optional().default(''),
  pickup_notes: z.string().optional().default(''),
  delivery_time: z.string().optional().default(''),
})

export const orderItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .number({ invalid_type_error: 'Enter a number' })
    .positive('Must be greater than 0'),
  unit_price: z
    .number({ invalid_type_error: 'Enter a price' })
    .min(0, 'Price cannot be negative'),
})

export const paymentSchema = z.object({
  method: z
    .enum(['cash', 'gcash', 'card', 'bank_transfer'])
    .default('cash'),
  amount_tendered: z
    .number({ invalid_type_error: 'Enter amount' })
    .min(0, 'Must be 0 or more')
    .default(0),
})

export const orderSchema = z.object({
  customer: customerSchema,
  order_date: z.string().min(1, 'Order date is required'),
  order_time: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  items: z.array(orderItemSchema).min(1, 'Add at least one item'),
  payment: paymentSchema,
  print_receipt: z.boolean().default(true),
})

// Inferred types from Zod schemas
export type CustomerSchema = z.infer<typeof customerSchema>
export type OrderItemSchema = z.infer<typeof orderItemSchema>
export type PaymentSchema = z.infer<typeof paymentSchema>
export type OrderSchema = z.infer<typeof orderSchema>