import { AuthResponse } from 'src/types/auth.type'
import { User } from 'src/types/user.type'
import http from 'src/utils/http'
interface BodyUpdateProfile extends Omit<User, '_id' | 'role' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}
export const registerAccount = (body: {
  name: string
  email: string
  password: string
  confirmPassword: string
  otp: string
}) => http.post<AuthResponse>('/user/sign-up', body)

export const verifyAccount = (body: { email: string }) => http.post('/user/send-otp', body)
export const userResetPassword = (body: { email: string; otp: string; password: string }) =>
  http.put('/user/reset-password', body)

export const loginAccount = (body: { email: string; password: string }) =>
  http.post<AuthResponse>('/user/sign-in', body)
export const logout = () => http.post('/user/log-out')
export const updateUser = (id: unknown, params?: Omit<BodyUpdateProfile, '_id'>) =>
  http.put<User>(`/user/update-user/${id}`, params)
export const getUser = (id: unknown) => http.get<User>(`/user/get-details/${id}`)
// export const refreshToken = (body: { refresh_token: string }) => http.post('/user/refresh-token', body)
export const refreshToken = () =>
  http.post('/user/refresh-token', {
    withCredentials: true
  })
