import { Product } from './product.type'
import { User } from './user.type'

export interface OrderItem {
  name: string
  amout: number
  image: string
  price: string
  product: Product
}
export interface ShippingAddress {
  fullName: string
  address: string
  phone: number
}
export interface Order {
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  user: User
  isPaid: boolean
  isDelivered: boolean
  //   paidAt:  // Thời gian thanh toán
  //   deliveredAt: { type: Date } // Thời gian giao hàng
}
