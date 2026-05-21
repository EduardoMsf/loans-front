import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'

interface LoginPayload {
  email: string
  password: string
}
interface LoginResponse {
  accessToken: string
  refreshToken: string
}
interface ReAuthPayload {
  email: string
  password: string
}
interface ReAuthResponse {
  signatureToken: string
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 600))
      return {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1LTAwMSIsImVtYWlsIjoiYW5hLmdhcmNpYUBleGFtcGxlLmNvbSIsIm5hbWUiOiJBbmEgR2FyY8OtYSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.mock-signature',
        refreshToken: 'mock-refresh-token',
      }
    }
    const { data } = await apiClient.post<{ data: LoginResponse }>('/auth/login', payload)
    return data.data
  },

  async register(payload: { name: string; email: string; password: string }): Promise<void> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 600))
      return
    }
    await apiClient.post('/auth/register', payload)
  },

  async forgotPassword(email: string): Promise<void> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 500))
      return
    }
    await apiClient.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 500))
      return
    }
    await apiClient.post('/auth/reset-password', { token, password })
  },

  async reAuthenticate(payload: ReAuthPayload): Promise<ReAuthResponse> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 700))
      return { signatureToken: `sig-token-${Date.now()}` }
    }
    const { data } = await apiClient.post<{ data: ReAuthResponse }>('/auth/re-auth', payload)
    return data.data
  },
}
