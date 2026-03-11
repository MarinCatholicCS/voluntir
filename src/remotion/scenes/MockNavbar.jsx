import { C } from '../../constants'

const NAV_ITEMS = ['Events', 'My Listings', 'Leaderboard', 'Create', 'Profile']

const LOGO_SRC = import.meta.env.BASE_URL + 'voluntir.png'

// Logout icon matching I.Logout
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function MockNavbar({ active = 'Events' }) {
  return (
    <nav style={{
      height: 64, background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.borderLight}`,
      padding: '0 24px', flexShrink: 0,
      fontFamily: "'Asap', sans-serif",
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Logo - matches real Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <img src={LOGO_SRC} alt="" style={{ width: 34, height: 34, objectFit: 'cover' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: C.textPrimary, letterSpacing: '-0.02em' }}>Voluntir</span>
          <span style={{ background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.2 }}>Beta</span>
        </div>

        {/* Nav pill - absolutely centered */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'rgba(226,240,213,0.45)', border: `1px solid ${C.borderLight}`,
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          padding: 3, borderRadius: 999,
          boxShadow: `0 2px 12px ${C.shadow}`,
        }}>
          {NAV_ITEMS.map(item => {
            const isActive = item === active
            return (
              <div key={item} style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 16px', borderRadius: 999,
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? C.greenDark : C.textSecondary,
                minHeight: 38,
              }}>
                {isActive && (
                  <div style={{
                    position: 'absolute', inset: 0, background: C.greenLight,
                    borderRadius: 999, zIndex: 0,
                  }} />
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
                    width: 32, height: 4, background: C.greenAccent,
                    borderRadius: '4px 4px 0 0',
                  }} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{item}</span>
              </div>
            )
          })}
        </div>

        {/* Auth button - matches real Navbar logout */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 12px', borderRadius: 9,
          border: `1px solid ${C.border}`, background: 'transparent',
          color: C.textMuted, fontSize: 12, fontWeight: 600,
        }}>
          <LogoutIcon />Log out
        </div>
      </div>
    </nav>
  )
}
