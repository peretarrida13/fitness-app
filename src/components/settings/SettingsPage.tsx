import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSettingsStore } from '@/store/useSettingsStore'

interface FieldProps {
  label: string
  description: string
  value: number
  unit: string
  min: number
  max: number
  onChange: (v: number) => void
}

function SettingField({ label, description, value, unit, min, max, onChange }: FieldProps) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--edge)',
      borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{description}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!isNaN(v) && v >= min && v <= max) onChange(v)
            }}
            style={{
              width: 80, padding: '7px 10px', textAlign: 'right',
              background: 'var(--bg2)', border: '1px solid var(--edge)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)',
              fontSize: 15, fontWeight: 600, outline: 'none',
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text3)', minWidth: 24 }}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const settings = useSettingsStore()

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '48px 20px 14px',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--card)', border: '1px solid var(--edge)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text2)', flexShrink: 0,
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 22, fontWeight: 700, color: 'var(--text)',
            letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            Goals & Settings
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
            Stored locally on this device
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 16px 96px' }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
          marginBottom: 10,
        }}>
          Body Goals
        </div>

        <SettingField
          label="Weight goal"
          description="Target body weight"
          value={settings.weightGoalKg}
          unit="kg"
          min={40}
          max={200}
          onChange={settings.setWeightGoalKg}
        />

        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
          marginBottom: 10, marginTop: 20,
        }}>
          Daily Nutrition
        </div>

        <SettingField
          label="Calorie target"
          description="Daily energy intake goal"
          value={settings.calorieTarget}
          unit="kcal"
          min={1000}
          max={5000}
          onChange={settings.setCalorieTarget}
        />
        <SettingField
          label="Protein target"
          description="Daily protein intake goal"
          value={settings.proteinTarget}
          unit="g"
          min={50}
          max={400}
          onChange={settings.setProteinTarget}
        />
        <SettingField
          label="Water goal"
          description="Daily hydration target"
          value={settings.waterGoalMl}
          unit="ml"
          min={500}
          max={6000}
          onChange={settings.setWaterGoalMl}
        />

        <div style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
          marginBottom: 10, marginTop: 20,
        }}>
          Activity
        </div>

        <SettingField
          label="Step goal"
          description="Daily steps target"
          value={settings.stepGoal}
          unit="steps"
          min={1000}
          max={30000}
          onChange={settings.setStepGoal}
        />
      </div>
    </div>
  )
}
