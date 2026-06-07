import type { WhoopToday } from '@/hooks/useWhoopData'

interface Props {
  data: WhoopToday | null | undefined
  onOpenModal: () => void
}

function RecoveryRing({ score }: { score: number | null }) {
  const size = 72
  const sw = 7
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pct = score !== null ? score / 100 : 0
  const offset = circ * (1 - pct)
  const color = score === null
    ? 'var(--edge)'
    : score >= 67 ? 'var(--green)' : score >= 34 ? 'var(--gold)' : 'var(--red)'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s' }}
      />
      <g transform={`rotate(90, ${size / 2}, ${size / 2})`}>
        <text x={size / 2} y={size / 2 - 3} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: color, fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {score !== null ? score : '—'}
        </text>
        <text x={size / 2} y={size / 2 + 11} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: 'var(--text3)', fontSize: 7, fontFamily: 'inherit' }}>
          {score !== null ? 'RECOVERY' : 'NO DATA'}
        </text>
      </g>
    </svg>
  )
}

export function WhoopCard({ data, onOpenModal }: Props) {
  const recovery = data?.recovery ?? null
  const strain = data?.strain ?? null
  const score = recovery?.score ?? null
  const strainScore = strain?.score

  const scoreColor = score === null ? 'var(--text3)'
    : score >= 67 ? 'var(--green)' : score >= 34 ? 'var(--gold)' : 'var(--red)'

  const strainColor = strainScore == null ? 'var(--text3)'
    : strainScore > 14 ? 'var(--red)' : strainScore >= 10 ? 'var(--gold)' : 'var(--accent)'

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--edge)',
      borderRadius: 'var(--radius)', padding: '14px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Whoop
        </div>
        {data?.stale && (
          <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>Stale</div>
        )}
        {!data && (
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>Offline</div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <RecoveryRing score={score} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: strainColor, fontFamily: "'Space Grotesk', sans-serif" }}>
              {strainScore !== null && strainScore !== undefined ? strainScore.toFixed(1) : '—'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>/21 strain</span>
          </div>
          {strain?.level && (
            <div style={{ fontSize: 12, color: strainColor, fontWeight: 600, textTransform: 'capitalize' }}>
              {strain.level}
            </div>
          )}
          {data?.heart_rate && (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              ❤ {data.heart_rate} bpm
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {score !== null && (
            <div style={{ fontSize: 11, color: scoreColor, fontWeight: 600 }}>
              {score >= 67 ? 'Green' : score >= 34 ? 'Yellow' : 'Red'}
            </div>
          )}
          {data?.battery && (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              🔋 {data.battery.percent}%
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onOpenModal}
        style={{
          width: '100%', marginTop: 12, padding: '8px 0',
          background: data ? 'var(--accentbg)' : 'var(--bg2)',
          border: `1px solid ${data ? 'var(--accentbd)' : 'var(--edge)'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: 12, fontWeight: 600,
          color: data ? 'var(--accent)' : 'var(--text3)',
          cursor: 'pointer', transition: 'opacity 0.15s',
        }}
      >
        {data ? 'View details →' : 'Whoop offline'}
      </button>
    </div>
  )
}
