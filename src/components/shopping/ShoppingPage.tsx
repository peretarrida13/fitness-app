import { ShoppingContent } from './ShoppingContent'

export function ShoppingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--edge)',
        padding: '14px 16px 0',
      }}>
        <div style={{ marginBottom: 14 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0,
          }}>Shopping List</h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', margin: '2px 0 0' }}>
            All ingredients for the week
          </p>
        </div>
      </div>
      <ShoppingContent />
    </div>
  )
}
