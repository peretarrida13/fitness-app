import type { WhoopHrZones, WhoopSleep, WhoopStressBreakdown } from '@/hooks/useWhoopData'
import { useWhoopData } from '@/hooks/useWhoopData'

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  green: 'var(--green)',
  gold: 'var(--gold)',
  red: 'var(--red)',
  accent: 'var(--accent)',
  purple: '#9b8dee',
  teal: '#2dd4bf',
  pink: '#f472b6',
  orange: '#fb923c',
}

const ZONE_META = [
  { key: 'zone1' as const, label: 'Z1', desc: '50–60% HRR', color: '#60a5fa' },
  { key: 'zone2' as const, label: 'Z2', desc: '60–70%',     color: '#34d399' },
  { key: 'zone3' as const, label: 'Z3', desc: '70–80%',     color: '#fbbf24' },
  { key: 'zone4' as const, label: 'Z4', desc: '80–90%',     color: '#f97316' },
  { key: 'zone5' as const, label: 'Z5', desc: '90–100%',    color: '#ef4444' },
]

// ── Primitive components ───────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--edge)',
      borderRadius: 'var(--radius)', padding: '14px 16px',
      marginBottom: 10, ...style,
    }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: 'var(--text3)',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

function Row({ label, value, unit, color, sub }: {
  label: string; value: string | number | null | undefined
  unit?: string; color?: string; sub?: string
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--edge)',
    }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: color ?? 'var(--text)', fontFamily: "'Space Grotesk', sans-serif" }}>
        {value !== null && value !== undefined ? `${value}${unit ? ' ' + unit : ''}` : '—'}
      </span>
    </div>
  )
}

// Goose-style metric card (2-column grid)
function MetricCard({ label, value, unit, color, icon, sub }: {
  label: string; value: string | number | null | undefined
  unit?: string; color: string; icon: string; sub?: string
}) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--edge)',
      borderRadius: 'var(--radius)', padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div>
        <span style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
          {value !== null && value !== undefined ? value : '—'}
        </span>
        {unit && value !== null && value !== undefined && (
          <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>{unit}</span>
        )}
      </div>
      {sub && <div style={{ fontSize: 11, fontWeight: 600, color }}>{sub}</div>}
    </div>
  )
}

// Recovery / Strain ring
function Ring({ score, max = 100, label, color }: {
  score: number | null; max?: number; label: string; color: string
}) {
  const size = 110, sw = 10, r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pct = score !== null ? Math.min(score / max, 1) : 0
  const offset = circ * (1 - pct)
  const display = score !== null ? (max === 21 ? score.toFixed(1) : score) : '—'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <g transform={`rotate(90, ${size / 2}, ${size / 2})`}>
        <text x={size / 2} y={size / 2 - 5} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: color, fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {display}
        </text>
        <text x={size / 2} y={size / 2 + 13} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: 'var(--text3)', fontSize: 8.5, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </text>
      </g>
    </svg>
  )
}

// ── Sleep stage bar ────────────────────────────────────────────────────────────
const STAGE_META = [
  { key: 'deep',  label: 'Deep',  color: C.accent },
  { key: 'rem',   label: 'REM',   color: C.purple },
  { key: 'light', label: 'Light', color: '#60a5fa' },
  { key: 'awake', label: 'Awake', color: 'var(--bg3)' },
]

function SleepStageBar({ sleep }: { sleep: WhoopSleep }) {
  const total = sleep.time_in_bed || 1
  return (
    <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1, marginBottom: 14 }}>
      {STAGE_META.map(({ key, color }) => {
        const mins = sleep[key as keyof WhoopSleep] as number || 0
        const pct = (mins / total) * 100
        return <div key={key} style={{ width: `${pct}%`, background: color, transition: 'width 0.4s', minWidth: pct > 1 ? 2 : 0 }} />
      })}
    </div>
  )
}

// ── Sleep quality label ────────────────────────────────────────────────────────
function sleepQuality(score: number | null): string {
  if (score === null) return ''
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Poor'
}
function sleepQualityColor(score: number | null): string {
  if (score === null) return 'var(--text3)'
  if (score >= 85) return C.green
  if (score >= 70) return C.accent
  if (score >= 50) return C.gold
  return C.red
}

// ── Stress breakdown bars ──────────────────────────────────────────────────────
function StressBreakdownBars({ breakdown }: { breakdown: WhoopStressBreakdown }) {
  const bars = [
    { label: 'High', pct: breakdown.high, color: C.red },
    { label: 'Med',  pct: breakdown.medium, color: C.gold },
    { label: 'Low',  pct: breakdown.low, color: C.teal },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
      {bars.map(({ label, pct, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', width: 28, flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color, width: 30, textAlign: 'right', fontFamily: "'Space Grotesk', sans-serif" }}>
            {pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ── HR Zone ribbon ─────────────────────────────────────────────────────────────
function HrZoneRibbon({ zones }: { zones: WhoopHrZones }) {
  const total = Object.values(zones).reduce((s, v) => s + v, 0)
  return (
    <div>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1, marginBottom: 10 }}>
        {ZONE_META.map(({ key, color }) => {
          const pct = total > 0 ? (zones[key] / total) * 100 : 20
          return <div key={key} style={{ width: `${pct}%`, background: color, transition: 'width 0.4s', minWidth: pct > 0 ? 2 : 0 }} />
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ZONE_META.map(({ key, label, desc, color }) => {
          const mins = zones[key] ?? 0
          const pct = total > 0 ? Math.round((mins / total) * 100) : 0
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--edge)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {mins > 0 ? `${mins.toFixed(0)}m` : '—'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{mins > 0 ? `${pct}%` : ''}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function WhoopPage() {
  const { data, isFetching } = useWhoopData()

  const r = data?.recovery
  const s = data?.strain
  const sleep = data?.sleep
  const stress = data?.stress
  const hrv = r?.hrv
  const zones = data?.hr_zones ?? null

  const recoveryScore = r?.score ?? null
  const strainScore = s?.score ?? null
  const sleepScore = sleep?.score ?? null

  const recoveryColor = recoveryScore === null ? 'var(--edge)'
    : recoveryScore >= 67 ? C.green : recoveryScore >= 34 ? C.gold : C.red
  const strainColor = strainScore === null ? 'var(--edge)'
    : strainScore > 14 ? C.red : strainScore >= 10 ? C.gold : C.accent

  const twoCol: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10,
  }

  return (
    <div>
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '14px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          Whoop
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {data?.stale && (
            <div style={{ fontSize: 11, fontWeight: 600, color: C.gold, background: 'rgba(240,192,96,0.12)', border: '1px solid rgba(240,192,96,0.25)', borderRadius: 20, padding: '2px 8px' }}>
              Stale
            </div>
          )}
          {isFetching && <div style={{ fontSize: 11, color: 'var(--text3)' }}>Syncing…</div>}
          {!data && !isFetching && <div style={{ fontSize: 11, color: 'var(--text3)' }}>Offline</div>}
        </div>
      </div>

      <div style={{ padding: '12px 16px 96px' }}>

        {/* ── TODAY focus — 2×2 ring cards (Recovery / Strain) ────────────── */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Ring score={recoveryScore} label="Recovery" color={recoveryColor} />
              {r?.level && <div style={{ fontSize: 12, fontWeight: 600, color: recoveryColor }}>{r.level}</div>}
            </div>
            <div style={{ width: 1, height: 90, background: 'var(--edge)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Ring score={strainScore} max={21} label="Strain" color={strainColor} />
              {s?.level && <div style={{ fontSize: 12, fontWeight: 600, color: strainColor, textTransform: 'capitalize' }}>{s.level}</div>}
            </div>
          </div>
        </Card>

        {/* ── Health Monitor — 2-column metric cards (goose HomeHealthMetricCard) */}
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6, marginBottom: 8 }}>Health Monitor</div>
        <div style={twoCol}>
          <MetricCard label="Heart Rate" value={data?.heart_rate ?? null} unit="bpm"
            color={C.red} icon="❤️" sub={data?.heart_rate ? 'Live' : undefined} />
          <MetricCard label="Resting HR" value={data?.rhr ?? null} unit="bpm"
            color={C.orange} icon="💤" sub={data?.rhr ? 'Today min' : undefined} />
          <MetricCard label="HRV (rMSSD)" value={hrv?.rmssd ?? null} unit="ms"
            color={C.purple} icon="〰️" sub={hrv?.rmssd ? 'RMSSD' : undefined} />
          <MetricCard label="Resp Rate" value={data?.respiratory_rate ?? null} unit="brpm"
            color={C.teal} icon="🌬️" />
          <MetricCard label="SpO₂" value={data?.spo2 ?? null} unit="%"
            color={C.accent} icon="🫁"
            sub={data?.spo2 ? (data.spo2 >= 95 ? 'Normal' : data.spo2 >= 90 ? 'Low' : 'Very Low') : undefined} />
          <MetricCard label="Skin Temp Δ"
            value={data?.skin_temp_delta != null ? `${data.skin_temp_delta > 0 ? '+' : ''}${data.skin_temp_delta.toFixed(1)}` : null}
            unit="°C" color={C.pink} icon="🌡️" />
        </div>

        {/* ── Sleep ───────────────────────────────────────────────────────── */}
        {sleep && sleep.time_in_bed > 0 && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <SectionLabel>Sleep</SectionLabel>
              {sleepScore !== null && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: sleepQualityColor(sleepScore), fontFamily: "'Space Grotesk', sans-serif" }}>
                    {sleepScore}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: sleepQualityColor(sleepScore) }}>
                    {sleepQuality(sleepScore)}
                  </div>
                </div>
              )}
            </div>

            {/* Stage bar */}
            <SleepStageBar sleep={sleep} />

            {/* Stage legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 12 }}>
              {STAGE_META.map(({ key, label, color }) => {
                const mins = sleep[key as keyof WhoopSleep] as number || 0
                const h = Math.floor(mins / 60), m = mins % 60
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginLeft: 'auto', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {h > 0 ? `${h}h ${m}m` : `${m}m`}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Sleep stats */}
            {sleep.efficiency !== null && (
              <Row label="Efficiency" value={Math.round(sleep.efficiency * 100)} unit="%" color={sleep.efficiency >= 0.85 ? C.green : sleep.efficiency >= 0.7 ? C.gold : C.red} />
            )}
            <Row label="Asleep" value={(() => { const h = Math.floor(sleep.total_asleep / 60); const m = Math.round(sleep.total_asleep % 60); return h > 0 ? `${h}h ${m}m` : `${m}m` })()} color="var(--text)" />
            <Row label="In Bed" value={(() => { const h = Math.floor(sleep.time_in_bed / 60); const m = Math.round(sleep.time_in_bed % 60); return h > 0 ? `${h}h ${m}m` : `${m}m` })()} color="var(--text2)" />
          </Card>
        )}

        {/* ── Heart Rate Variability ──────────────────────────────────────── */}
        <Card>
          <SectionLabel>Heart Rate Variability</SectionLabel>
          {hrv?.rmssd != null ? (
            <>
              {/* Big number + quality */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 48, fontWeight: 700, color: C.purple, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                      {hrv.rmssd}
                    </span>
                    <span style={{ fontSize: 16, color: 'var(--text3)' }}>ms</span>
                  </div>
                  {(() => {
                    const v = hrv.rmssd!
                    const [label, color] = v >= 70 ? ['Excellent', C.green] : v >= 40 ? ['Good', C.accent] : v >= 20 ? ['Normal', C.gold] : ['Low', C.red]
                    return <div style={{ fontSize: 14, fontWeight: 600, color, marginTop: 2 }}>{label}</div>
                  })()}
                </div>
                {/* Visual gauge */}
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>
                  <div style={{ color: C.green }}>70+ Excellent</div>
                  <div style={{ color: C.accent }}>40–70 Good</div>
                  <div style={{ color: C.gold }}>20–40 Normal</div>
                  <div style={{ color: C.red }}>{'<20 Low'}</div>
                </div>
              </div>

              {/* Plain-language description */}
              <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 14, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8 }}>
                Measures how much the time between your heartbeats varies. Higher means your nervous system is well-recovered and ready for stress or training.
              </div>

              {/* Only two rows users actually care about */}
              {hrv.mean_nn != null && (
                <Row
                  label="Average beat interval"
                  value={Math.round(hrv.mean_nn)}
                  unit="ms"
                  sub={`≈ ${Math.round(60000 / hrv.mean_nn)} bpm resting`}
                />
              )}
            </>
          ) : (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>Waiting for heart rate data from your Whoop…</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>HRV is calculated from beat-to-beat timing. Make sure your strap is on your wrist.</div>
            </div>
          )}
        </Card>

        {/* ── Stress ──────────────────────────────────────────────────────── */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <SectionLabel>Stress</SectionLabel>
            {stress && (
              <span style={{ fontSize: 11, fontWeight: 600, color: stress.score >= 67 ? C.red : stress.score >= 34 ? C.gold : C.teal, textTransform: 'capitalize' }}>
                {stress.level}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: C.gold, fontFamily: "'Space Grotesk', sans-serif" }}>
              {stress?.score ?? '—'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>/100</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', borderRadius: 3, background: C.gold, width: `${stress?.score ?? 0}%`, transition: 'width 0.4s' }} />
          </div>
          {stress?.breakdown && <StressBreakdownBars breakdown={stress.breakdown} />}
        </Card>

        {/* ── Activity & HR Zones ─────────────────────────────────────────── */}
        <Card>
          <SectionLabel>Activity</SectionLabel>
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Today's Strain</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: strainColor, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {strainScore !== null ? strainScore.toFixed(1) : '—'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>/21</span>
              </div>
              {s?.level && <div style={{ fontSize: 11, fontWeight: 600, color: strainColor, textTransform: 'capitalize', marginTop: 2 }}>{s.level}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Calories Burned</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: C.orange, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {data?.energy?.kcal ?? '—'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>kcal</span>
              </div>
            </div>
          </div>
          {/* Only show zone detail when there's actual workout time recorded */}
          {zones && Object.values(zones).reduce((s, v) => s + v, 0) > 0 ? (
            <HrZoneRibbon zones={zones} />
          ) : (
            <div style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8, fontSize: 12, color: 'var(--text3)' }}>
              No workout recorded yet today. HR zones will appear here during and after exercise.
            </div>
          )}
        </Card>

        {/* ── Device & Battery ────────────────────────────────────────────── */}
        <Card>
          <SectionLabel>Device</SectionLabel>
          {data?.battery && (
            <>
              <Row label="Battery" value={data.battery.percent} unit="%" color={data.battery.percent > 20 ? C.green : C.red} />
              {data.battery.charging && <Row label="Status" value="Charging" color={C.teal} />}
              <Row label="Est. days remaining" value={data.battery.estimated_days_remaining} unit="d" />
            </>
          )}
        </Card>

      </div>
    </div>
  )
}
