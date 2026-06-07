import { useQuery } from '@tanstack/react-query'

const BLE_BASE = import.meta.env.VITE_BLE_BACKEND_URL as string | undefined

export interface WhoopHrv {
  rmssd: number | null
  sdnn: number | null
  pnn50: number | null
  mean_nn: number | null
}

export interface WhoopToday {
  recovery: { score: number | null; level: string | null; hrv: WhoopHrv | null } | null
  strain: { score: number | null; level: string | null } | null
  sleep: Record<string, number> | null
  battery: { percent: number; charging: boolean; estimated_days_remaining: number } | null
  heart_rate: number | null
  stress: { score: number; level: string } | null
  energy: { kcal: number } | null
  stale: boolean
}

export function useWhoopData() {
  return useQuery<WhoopToday | null>({
    queryKey: ['whoop-today'],
    enabled: !!BLE_BASE,
    refetchInterval: 60_000,
    staleTime: 55_000,
    retry: false,
    queryFn: async () => {
      if (!BLE_BASE) return null
      try {
        const res = await fetch(`${BLE_BASE}/today`)
        if (!res.ok) return null
        return (await res.json()) as WhoopToday
      } catch {
        return null
      }
    },
  })
}
