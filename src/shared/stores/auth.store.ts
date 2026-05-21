import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  email: string
  name: string
  iat: number
  exp: number
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: { id: string; email: string; name: string } | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken)
          set({
            accessToken,
            refreshToken,
            user: { id: decoded.sub, email: decoded.email, name: decoded.name },
            isAuthenticated: true,
          })
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)
          document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
        } catch {
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
        }
      },

      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        document.cookie = 'access_token=; path=/; max-age=0'
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
