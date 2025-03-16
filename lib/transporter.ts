import axios from 'axios'
import { tokenStore } from './tokenStore'

const ApiUrl = process.env.NEXT_PUBLIC_API_URL!

const transporter = axios.create({
  baseURL: ApiUrl+'/api',
})

transporter.interceptors.request.use(
  (config) => {
    const token = tokenStore.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

transporter.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await axios.post(
          `${ApiUrl}/auth/token`,
          {},
          {
            withCredentials: true,
          }
        )

        if (response.data.success) {
          tokenStore.setToken(response.data.accessToken)

          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
          return transporter(originalRequest)
        }
      } catch (refreshError) {
        tokenStore.clearToken()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error?.response?.data)
  }
)

export default transporter
