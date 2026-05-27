export function ProgressPage() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Progress</h1>
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>
        Connect Supabase to start logging workouts and tracking your progress over time.
      </p>
      <div
        style={{
          marginTop: 24, padding: 20, background: 'var(--card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--border)',
          textAlign: 'center', color: 'var(--text3)',
        }}
      >
        Coming soon: workout logs, body weight charts, PR tracking
      </div>
    </div>
  )
}
