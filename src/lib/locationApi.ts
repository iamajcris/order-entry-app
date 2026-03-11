import axios from 'axios'
import type {
  TypeOption,
} from '@/types'

// ─────────────────────────────────────────
//  Base client
//  👇 Change VITE_LOCATION_API_URL in your .env file
// ─────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_LOCATION_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// Unwrap response data and normalize errors
apiClient.interceptors.response.use(
  (res) => res.data,
  (err: unknown) => {
    let message = 'Something went wrong'
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined
      message =
        (data?.message as string) ??
        (data?.error as string) ??
        err.message
    }
    return Promise.reject(new Error(message))
  }
)

export const locationApi = {
  getCitiesMunicipalities: (region: string, provinces: string): Promise<TypeOption[]> =>
    apiClient.get(`${BASE_URL}/regions/${region}/provinces/${provinces}/cities-municipalities`).then(({ data }) =>
      data.map((item: { code: string; name: string }) => ({
        id: item.code,
        text: item.name,
      }))
    ),
  getBarangays: (region: string, provinces: string, city: string): Promise<TypeOption[]> =>
    apiClient.get(`${BASE_URL}/regions/${region}/provinces/${provinces}/cities-municipalities/${city}/barangays`).then(({ data }) =>
      data.map((item: { code: string; name: string }) => ({
        id: item.code,
        text: item.name,
      }))
    ),  
}