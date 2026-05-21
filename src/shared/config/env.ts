export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
} as const
