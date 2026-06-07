import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { WhoopToday } from '@/hooks/useWhoopData'

interface Props {
  open: boolean
  onClose: () => void
  data: WhoopToday | null | undefined
}

function Row({ label, value, unit, color }: {
  label: string; value: string | number | null | undefined; unit?: string; color?: string
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--edge)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
      <span style={{
        fontSize: 14, fontWeight: 600,
        color: color ?? 'var(--text)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        {value !== null && value !== undefined ? `${value}${unit ? ' ' + unit : ''}` : '—'}
      </span>
    </div>
  )
}

export function WhoopModal({ open, onClose, data }: Props) {
  const navigate = useNavigate()
  const r = data?.recovery
  const s = data?.strain
  const hrv = r?.hrv
  const stress = data?.stress
  const energy = data?.energy
  const battery = data?.battery
  const sleep = data?.sleep

  const recoveryColor = r?.score == null ? 'var(--text3)'
    : (r.score >= 67 ? 'var(--green)' : r.score >= 34 ? 'var(--gold)' : 'var(--red)')
  const strainColor = s?.score == null ? 'var(--text3)'
    : (s.score > 14 ? 'var(--red)' : s.score >= 10 ? 'var(--gold)' : 'var(--accent)')

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
        }} />
        <Dialog.Content style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
          background: 'var(--bg)',
          borderRadius: '18px 18px 0 0',
          padding: '20px 20px 36px',
          maxHeight: '88vh', overflowY: 'auto',
          outline: 'none',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Dialog.Title style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0,
            }}>
              Whoop Details
            </Dialog.Title>
            <Dialog.Close asChild>
              <button style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--bg2)', border: '1px solid var(--edge)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text3)',
              }}>
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {!data ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
              Whoop backend is offline
            </div>
          ) : (
            <>
              {/* Section: Recovery */}
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Recovery
              </div>
              <Row label="Score" value={r?.score} unit="/100" color={recoveryColor} />
              <Row label="Level" value={r?.level} color={recoveryColor} />

              {/* Section: Strain */}
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 2 }}>
                Strain
              </div>
              <Row label="Score" value={s?.score !== null && s?.score !== undefined ? s.score.toFixed(1) : null} unit="/21" color={strainColor} />
              <Row label="Level" value={s?.level} color={strainColor} />

              {/* Section: HRV */}
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 2 }}>
                HRV
              </div>
              <Row label="rMSSD" value={hrv?.rmssd} unit="ms" color="#9b8dee" />
              <Row label="SDNN" value={hrv?.sdnn} unit="ms" />
              <Row label="pNN50" value={hrv?.pnn50} unit="%" />
              <Row label="Mean NN" value={hrv?.mean_nn} unit="ms" />

              {/* Section: Stress */}
              {stress && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 2 }}>
                    Stress
                  </div>
                  <Row label="Score" value={stress.score} unit="/100" color="var(--gold)" />
                  <Row label="Level" value={stress.level} color="var(--gold)" />
                </>
              )}

              {/* Section: Sleep */}
              {sleep && Object.keys(sleep).length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 2 }}>
                    Sleep
                  </div>
                  {sleep.deep !== undefined && <Row label="Deep" value={sleep.deep} unit="min" color="var(--accent)" />}
                  {sleep.rem !== undefined && <Row label="REM" value={sleep.rem} unit="min" color="#9b8dee" />}
                  {sleep.light !== undefined && <Row label="Light" value={sleep.light} unit="min" />}
                  {sleep.awake !== undefined && <Row label="Awake" value={sleep.awake} unit="min" color="var(--text3)" />}
                </>
              )}

              {/* Section: Battery + Energy */}
              {(battery || energy) && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 2 }}>
                    Device &amp; Energy
                  </div>
                  {battery && <Row label="Battery" value={battery.percent} unit="%" />}
                  {battery && <Row label="Est. days remaining" value={battery.estimated_days_remaining} unit="d" />}
                  {energy && <Row label="Energy burned" value={energy.kcal} unit="kcal" color="var(--green)" />}
                </>
              )}
            </>
          )}

          {/* Footer */}
          <button
            onClick={() => { onClose(); navigate('/whoop') }}
            style={{
              width: '100%', marginTop: 20, padding: '11px 0',
              background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13, fontWeight: 600, color: '#fff',
              cursor: 'pointer',
            }}
          >
            Full dashboard →
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
