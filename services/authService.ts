import transporter from '../lib/transporter'
import { tokenStore } from '../lib/tokenStore'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  message: string
  success: boolean
  accessToken?: string
  _id?: string
  name?: string
  email?: string
}

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await transporter.post<AuthResponse, AuthResponse>(
      '/auth/login',
      data,
      {
        withCredentials: true,
      }
    )

    if (response.accessToken) {
      tokenStore.setToken(response.accessToken)
    }

    return response
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return transporter.post<AuthResponse, AuthResponse>('/auth/register', data)
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await transporter.get<AuthResponse, AuthResponse>(
      '/auth/logout',
      {
        withCredentials: true,
      }
    )

    tokenStore.clearToken()

    return response
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await transporter.post<AuthResponse, AuthResponse>(
      '/auth/token',
      {},
      {
        withCredentials: true,
      }
    )

    if (response.accessToken) {
      tokenStore.setToken(response.accessToken)
    }
    response.accessToken = undefined
    return response
  },

  isAuthenticated: (): boolean => {
    return tokenStore.hasToken()
  },
}

export default authService
