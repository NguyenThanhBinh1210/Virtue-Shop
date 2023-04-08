/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'src/utils/http'

// Comment
export const getCommentProduct = (product_id: string) => http.get(`/comment/get-comment/${product_id}`)
export const deleteComment = (comment_id: string) => http.delete(`/comment/${comment_id}`)
export const createComment = (id: string, body: any) => http.post(`/comment/${id}`, body)

// Evaluate
export const getEvaluateProduct = (product_id: string) => http.get(`/evaluate/${product_id}`)
export const createEvaluate = (id: string, body: any) => http.put(`/evaluate/${id}`, body)
