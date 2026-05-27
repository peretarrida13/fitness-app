export function CalendarPage() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Calendar</h1>
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>
        Plan and schedule your workouts and meals across the week.
      </p>
      <div
        style={{
          marginTop: 24, padding: 20, background: 'var(--card)',
          borderRadius: 'var(--radius)', border: '1px solid var(--border)',
          textAlign: 'center', color: 'var(--text3)',
        }}
      >
        Coming soon: weekly calendar view, workout scheduling
      </div>
    </div>
  )
}
