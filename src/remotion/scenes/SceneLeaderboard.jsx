import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { C } from '../../constants'
import MockNavbar from './MockNavbar'

const LEADERS = [
  { name: 'Sarah K.', school: 'Marin Catholic', hours: 142 },
  { name: 'Alex M.', school: 'Redwood High', hours: 118 },
  { name: 'James L.', school: 'Tam High', hours: 95 },
]

const TABLE_ROWS = [
  { rank: 4, name: 'Emma W.', school: 'Drake High', hours: 87 },
  { rank: 5, name: 'Noah P.', school: 'Marin Catholic', hours: 72 },
  { rank: 6, name: 'Olivia R.', school: 'Redwood High', hours: 68 },
]

// Icons
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const SchoolIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>

// Avatar colors matching Common.jsx
const AVATAR_COLORS = [
  { bg: C.greenLight, text: C.greenDark },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#FCE4EC', text: '#AD1457' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
]

function AvatarMock({ name, size = 32, isTop3 = false }) {
  const initial = name[0]
  const colorIdx = (initial.charCodeAt(0)) % AVATAR_COLORS.length
  const c = AVATAR_COLORS[colorIdx]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      border: isTop3 ? `2px solid ${C.greenAccent}` : 'none',
    }}>{initial}</div>
  )
}

export default function SceneLeaderboard() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const inOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const outOpacity = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const headerY = interpolate(frame, [0, 16], [12, 0], { extrapolateRight: 'clamp' })

  // Podium order: 2nd, 1st, 3rd (matching real app)
  const podOrder = [1, 0, 2]
  const podRanks = ['2nd', '1st', '3rd']
  const podHeights = [170, 210, 150]
  const podWidths = [140, 160, 140]

  return (
    <AbsoluteFill style={{
      background: C.offWhite, fontFamily: "'Asap', sans-serif",
      opacity: inOpacity * outOpacity,
      flexDirection: 'column', display: 'flex',
    }}>
      <MockNavbar active="Leaderboard" />

      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: '20px 32px', boxSizing: 'border-box' }}>
        {/* Header - centered like real app */}
        <div style={{
          textAlign: 'center', marginBottom: 14,
          transform: `translateY(${headerY}px)`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em', marginBottom: 3 }}>
            Service Leaderboard
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary }}>
            Celebrating our top volunteers and schools.
          </div>
        </div>

        {/* Tab switcher - pill style matching real app */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 20,
        }}>
          <div style={{
            display: 'flex', gap: 2, background: C.white,
            borderRadius: 12, padding: 3,
            border: `1px solid ${C.borderLight}`,
          }}>
            <div style={{
              padding: '7px 16px', borderRadius: 10,
              background: C.greenLight, color: C.greenDark,
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <UserIcon />Volunteers
            </div>
            <div style={{
              padding: '7px 16px', borderRadius: 10,
              background: 'transparent', color: C.textSecondary,
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <SchoolIcon />Schools
            </div>
          </div>
        </div>

        {/* Podium - card style matching real LeaderboardPage */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
          {podOrder.map((idx, di) => {
            const leader = LEADERS[idx]
            const best = di === 1
            const delay = 18 + di * 8
            const cardScale = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 13, stiffness: 90 } })
            const cardOpacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

            return (
              <div key={idx} style={{
                background: C.white, borderRadius: 16,
                padding: '18px 14px', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                minHeight: podHeights[di], width: podWidths[di],
                border: best ? `2px solid ${C.greenAccent}` : `1px solid ${C.borderLight}`,
                boxShadow: best ? `0 4px 20px ${C.shadowMd}` : `0 1px 3px ${C.shadow}`,
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: best ? C.greenAccent : C.textMuted, marginBottom: 6 }}>{podRanks[di]}</div>
                <AvatarMock name={leader.name} size={best ? 44 : 34} isTop3 />
                <div style={{ fontSize: best ? 13 : 11, fontWeight: 700, color: C.textPrimary, margin: '6px 0 2px', lineHeight: 1.2 }}>{leader.name}</div>
                <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 3 }}>{leader.school}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.greenAccent }}>{leader.hours}</div>
                <div style={{ fontSize: 9, color: C.textMuted }}>hours</div>
              </div>
            )
          })}
        </div>

        {/* Table - matching real app grid layout */}
        <div style={{
          background: C.white, borderRadius: 16,
          border: `1px solid ${C.borderLight}`,
          overflow: 'hidden',
          boxShadow: `0 1px 3px ${C.shadow}`,
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 120px 100px',
            padding: '9px 14px', background: C.cream,
            fontSize: 9, fontWeight: 700, color: C.textMuted,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span style={{ textAlign: 'center' }}>Rank</span>
            <span>Volunteer</span>
            <span>School</span>
            <span style={{ textAlign: 'right' }}>Hours</span>
          </div>
          {/* Table rows */}
          {TABLE_ROWS.map((row, i) => {
            const delay = 48 + i * 8
            const rowOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            const rowX = interpolate(frame, [delay, delay + 10], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

            return (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 120px 100px',
                padding: '9px 14px', alignItems: 'center',
                borderTop: `1px solid ${C.borderLight}`,
                opacity: rowOpacity, transform: `translateX(${rowX}px)`,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textAlign: 'center' }}>#{row.rank}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AvatarMock name={row.name} size={26} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: C.textPrimary }}>{row.name}</span>
                </div>
                <span style={{ fontSize: 10, color: C.textMuted }}>{row.school}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.greenDark }}>{row.hours}</span>
                  <span style={{ fontSize: 9, color: C.textMuted, marginLeft: 2 }}>hrs</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}
