import { Purchase, Status } from 'src/types/purchase.type'
import http from 'src/utils/http'

export const getPurchases = (id: string, params: Status) => http.post(`/purchase/get-purchase/${id}`, params)
export const getPurchasesOnline = (id: string) => http.get(`/purchase/get-purchase-online/${id}`)

export const addToCart = (id: string, params: Purchase) => http.post(`/purchase/add-to-cart/${id}`, params)

export const buyProducts = (id: string, body: any) => {
  return http.put<Purchase[]>(`/purchase/buy-products/${id}`, body)
}
export const buyProductsOnline = (id: string, body: { id: string; totalPrice: number }) => {
  return http.put(`/payment/${id}`, body)
}
export const cancelBuy = (id: string, body: { reason: string; purchase_id: string }) => {
  return http.put(`/purchase/cancel-buy/${id}`, body)
}

export const updatePurchase = (id: string, body: { product_id: string; buy_count: number }) => {
  return http.put<Purchase>(`/purchase/update-purchase/${id}`, body)
}

export const changeStatusPurchase = (id: string, body: { product_id: string; purchase_id: string; status: number }) => {
  return http.put<Purchase>(`/purchase/confirm-purchase/${id}`, body)
}

export const deletePurchase = (id: string, purchaseIds: string[]) => {
  return http.delete<{ deleted_count: number }>(`/purchase/delete-purchase/${id}`, {
    data: purchaseIds
  })
}
