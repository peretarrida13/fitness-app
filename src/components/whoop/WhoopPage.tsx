import { useWhoopData } from '@/hooks/useWhoopData'

function Ring({ score, max = 100, label, color }: {
  score: number | null; max?: number; label: string; color: string
}) {
  const size = 110
  const sw = 10
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pct = score !== null ? Math.min(score / max, 1) : 0
  const offset = circ * (1 - pct)
  const display = score !== null ? (max === 21 ? score.toFixed(1) : score) : '—'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
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

function MetricRow({ label, value, unit, color }: {
  label: string; value: string | number | null | undefined; unit?: string; color?: string
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--edge)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color ?? 'var(--text)', fontFamily: "'Space Grotesk', sans-serif" }}>
        {value !== null && value !== undefined ? `${value}${unit ? ' ' + unit : ''}` : '—'}
      </span>
    </div>
  )
}

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
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
      {children}
    </div>
  )
}

export function WhoopPage() {
  const { data, isFetching } = useWhoopData()

  const r = data?.recovery
  const s = data?.strain
  const hrv = r?.hrv
  const stress = data?.stress
  const energy = data?.energy
  const battery = data?.battery
  const sleep = data?.sleep

  const recoveryScore = r?.score ?? null
  const strainScore = s?.score ?? null

  const recoveryColor = recoveryScore === null ? 'var(--edge)'
    : recoveryScore >= 67 ? 'var(--green)' : recoveryScore >= 34 ? 'var(--gold)' : 'var(--red)'
  const strainColor = strainScore === null ? 'var(--edge)'
    : strainScore > 14 ? 'var(--red)' : strainScore >= 10 ? 'var(--gold)' : 'var(--accent)'

  const stressVal = stress?.score ?? null
  const stressPct = stressVal !== null ? stressVal : 0

  return (
    <div>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '14px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0,
        }}>
          Whoop
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {data?.stale && (
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--gold)',
              background: 'rgba(240,192,96,0.12)', border: '1px solid rgba(240,192,96,0.25)',
              borderRadius: 20, padding: '2px 8px',
            }}>
              Stale
            </div>
          )}
          {isFetching && (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Syncing…</div>
          )}
          {!data && !isFetching && (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Offline</div>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 16px 96px' }}>
        {/* Recovery + Strain rings */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Ring score={recoveryScore} max={100} label="Recovery" color={recoveryColor} />
              {r?.level && (
                <div style={{ fontSize: 12, fontWeight: 600, color: recoveryColor }}>{r.level}</div>
              )}
            </div>
            <div style={{ width: 1, height: 90, background: 'var(--edge)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Ring score={strainScore} max={21} label="Strain" color={strainColor} />
              {s?.level && (
                <div style={{ fontSize: 12, fontWeight: 600, color: strainColor, textTransform: 'capitalize' }}>{s.level}</div>
              )}
            </div>
          </div>
        </Card>

        {/* HRV */}
        <Card>
          <SectionLabel>HRV</SectionLabel>
          <MetricRow label="rMSSD" value={hrv?.rmssd} unit="ms" color="#9b8dee" />
          <MetricRow label="SDNN" value={hrv?.sdnn} unit="ms" />
          <MetricRow label="pNN50" value={hrv?.pnn50} unit="%" />
          <MetricRow label="Mean NN" value={hrv?.mean_nn} unit="ms" />
        </Card>

        {/* Stress */}
        <Card>
          <SectionLabel>Stress</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--gold)', fontFamily: "'Space Grotesk', sans-serif" }}>
              {stressVal !== null ? stressVal : '—'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textTransform: 'capitalize' }}>
              {stress?.level ?? ''}
            </span>
          </div>
          {/* Stress bar */}
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: 'var(--gold)',
              width: `${stressPct}%`,
              transition: 'width 0.4s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
            <span>0</span><span>100</span>
          </div>
        </Card>

        {/* Sleep */}
        {sleep && Object.keys(sleep).length > 0 && (
          <Card>
            <SectionLabel>Sleep</SectionLabel>
            {sleep.deep !== undefined && <MetricRow label="Deep" value={sleep.deep} unit="min" color="var(--accent)" />}
            {sleep.rem !== undefined && <MetricRow label="REM" value={sleep.rem} unit="min" color="#9b8dee" />}
            {sleep.light !== undefined && <MetricRow label="Light" value={sleep.light} unit="min" />}
            {sleep.awake !== undefined && <MetricRow label="Awake" value={sleep.awake} unit="min" color="var(--text3)" />}
          </Card>
        )}

        {/* Battery & Energy */}
        <Card>
          <SectionLabel>Device &amp; Energy</SectionLabel>
          {data?.heart_rate && <MetricRow label="Heart rate" value={data.heart_rate} unit="bpm" color="var(--red)" />}
          {battery && (
            <>
              <MetricRow label="Battery" value={battery.percent} unit="%" />
              {battery.charging && <MetricRow label="Status" value="Charging ⚡" />}
              <MetricRow label="Est. days remaining" value={battery.estimated_days_remaining} unit="d" />
            </>
          )}
          {energy && <MetricRow label="Energy burned" value={energy.kcal} unit="kcal" color="var(--green)" />}
        </Card>
      </div>
    </div>
  )
}
