import axios, { type AxiosInstance } from 'axios'
import omit from 'lodash/omit'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccesTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS
} from './auth'
import { toast } from 'react-toastify'
class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:5000/api/',
      // baseURL: 'https://api-virtue-shop.onrender.com/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers['token'] = `Beare ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/user/sign-in' || url === '/user/sign-up' || url === '/user/google-login') {
          const dataProfile = response.data.data
          const newUser = omit(dataProfile, ['password', 'isAdmin'])
          this.accessToken = response.data.access_token
          this.refreshToken = response.data.refresh_token
          if (response.data.status !== 'ERR') {
            setProfileFromLS(newUser)
            setAccesTokenToLS(this.accessToken)
            setRefreshTokenToLS(this.refreshToken)
          }
        } else if (url === '/user/log-out') {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
          // Cookies.remove('refresh_token')
        }
        return response
      },
      (error) => {
        const config = error.response?.config || {}
        const { url } = config
        if (url !== 'user/refresh-token') {
          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : this.handleRefreshToken().finally(() => {
                this.refreshTokenRequest = null
              })
          return this.refreshTokenRequest.then((access_token) => {
            return this.instance({ ...config, headers: { ...config.headers, token: `Beare ${access_token}` } })
          })
        }
        toast.warn('Hết phiên đăng nhập, hãy đăng nhập lại!')
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post('user/refresh-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccesTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        window.location.reload()
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
