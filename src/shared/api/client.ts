import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@shared/config/env'
import { useAuthStore } from '@shared/stores/auth.store'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token')

        if (refreshToken) {
          try {
            const { data } = await axios.post<{
              data: { accessToken: string; refreshToken: string }
            }>(`${env.apiUrl}/auth/refresh`, { refreshToken })
            const { accessToken, refreshToken: newRefresh } = data.data
            useAuthStore.getState().setTokens(accessToken, newRefresh)
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return apiClient(originalRequest)
          } catch {
            useAuthStore.getState().clearAuth()
            window.location.href = '/login'
            return Promise.reject(error)
          }
        }

        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
