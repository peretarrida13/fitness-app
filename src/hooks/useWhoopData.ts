import { useQuery } from '@tanstack/react-query'

const BLE_BASE = import.meta.env.VITE_BLE_BACKEND_URL as string | undefined

export interface WhoopHrv {
  rmssd: number | null
  sdnn: number | null
  pnn50: number | null
  mean_nn: number | null
}

export interface WhoopHrZones {
  zone1: number
  zone2: number
  zone3: number
  zone4: number
  zone5: number
}

export interface WhoopSleep {
  deep: number
  rem: number
  light: number
  awake: number
  score: number | null        // 0–100, goose.sleep.v0
  efficiency: number | null   // 0–1 fraction
  total_asleep: number        // minutes (deep+rem+light)
  time_in_bed: number         // minutes (total_asleep+awake)
}

export interface WhoopStressBreakdown {
  high: number    // % of snapshots in high stress
  medium: number
  low: number
}

export interface WhoopToday {
  recovery: { score: number | null; level: string | null; hrv: WhoopHrv | null } | null
  strain: { score: number | null; level: string | null } | null
  sleep: WhoopSleep | null
  battery: { percent: number; charging: boolean; estimated_days_remaining: number } | null
  heart_rate: number | null
  rhr: number | null
  respiratory_rate: number | null
  spo2: number | null
  skin_temp_delta: number | null
  stress: { score: number; level: string; breakdown: WhoopStressBreakdown } | null
  energy: { kcal: number } | null
  hr_zones: WhoopHrZones | null
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
