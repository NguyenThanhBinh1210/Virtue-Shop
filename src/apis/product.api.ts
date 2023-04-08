import { ProductList } from 'src/types/product.type'
import http from 'src/utils/http'

export const getProduct = (params?: unknown) => http.get<ProductList>('/product/get-all', { params })
export const getAllProduct = () => http.get<ProductList>('/product/get-all')
export const searchProduct = (params?: unknown) => http.get<ProductList>('/product/get-all', { params })
export const getProductDetail = (id: string) => http.get(`/product/get-details/${id}`)
export const ratingProduct = (body?: unknown) => http.put(`/product/evaluate`, body)
