import axios, { type AxiosInstance } from 'axios'
import omit from 'lodash/omit'
import jwt_decode from 'jwt-decode'
import { clearLS, getAccessTokenFromLS, setAccesTokenToLS, setProfileFromLS } from './auth'
import { refreshToken } from 'src/apis/auth.api'
import Cookies from 'js-cookie'
class Http {
  instance: AxiosInstance
  private accessToken?: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://localhost:5000/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        if (this.accessToken) {
          // const userDecode: { exp: number } = jwt_decode(this.accessToken)
          // const timeout = userDecode?.exp
          // const currentTime = Date.now()
          // if (timeout < currentTime / 1000) {
          //   const body: { refresh_token: string } = {
          //     refresh_token: Cookies.get('refresh_token') as string
          //   }
          //   const data = await refreshToken(body)
          //   config.headers['token'] = `Beare ${data?.data.data.access_token}`
          //   return config
          // }
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
      async (response) => {
        const { url } = response.config
        if (url === '/user/sign-in' || url === '/user/sign-up') {
          const dataProfile = response.data.data
          const newUser = omit(dataProfile, ['password', 'isAdmin'])
          this.accessToken = response.data?.access_token
          if (response.data.status !== 'ERR') {
            setProfileFromLS(newUser)
            setAccesTokenToLS(this.accessToken as string)
          }
        } else if (url === '/user/log-out') {
          this.accessToken = ''
          clearLS()
          // Cookies.remove('refresh_token')
        }
        return response
      },
      function (error) {
        // if (error.response?.status !== 422) {
        //   const message = error.message
        //   console.log(message)
        // }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
