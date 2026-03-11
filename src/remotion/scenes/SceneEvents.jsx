import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { C } from '../../constants'
import MockNavbar from './MockNavbar'

const EVENTS = [
  { title: 'Beach Cleanup Day', org: 'Ocean Guardians', desc: 'Join us for a morning of cleaning up Stinson Beach! Gloves and bags provided.', date: 'Sat, Mar 15, 2026', loc: 'Stinson Beach, CA', current: 7, needed: 10, skills: ['Outdoors', 'Teamwork'] },
  { title: 'Food Bank Sorting', org: 'SF Food Bank', desc: 'Help sort and organize food donations for families in need across the city.', date: 'Wed, Mar 18, 2026', loc: 'San Francisco, CA', current: 5, needed: 12, skills: ['Organization'] },
  { title: 'Tutoring Session', org: 'Youth Scholars', desc: 'Provide after-school tutoring support to middle school students in math.', date: 'Fri, Mar 20, 2026', loc: 'San Rafael, CA', current: 9, needed: 10, skills: ['Teaching', 'Math'] },
]

// Calendar icon (matches I.Calendar)
const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
// MapPin icon (matches I.MapPin)
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

function EventCardMock({ event, index, frame, fps }) {
  const delay = 25 + index * 12
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 100 } })
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const pct = event.current / event.needed
  const barWidth = interpolate(frame, [delay + 15, delay + 40], [0, pct * 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const spots = event.needed - event.current
  const full = spots <= 0

  return (
    <div style={{
      background: C.white, borderRadius: 16, border: `1px solid ${C.borderLight}`,
      padding: 16, flex: 1, minWidth: 0,
      opacity,
      transform: `translateY(${(1 - s) * 30}px)`,
      boxShadow: `0 1px 3px ${C.shadow}`,
    }}>
      {/* Organizer */}
      <div style={{ fontSize: 9.5, fontWeight: 600, color: C.greenAccent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>
        {event.org}
      </div>
      {/* Title */}
      <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3, marginBottom: 4, letterSpacing: '-0.01em' }}>
        {event.title}
      </div>
      {/* Description - 2 line clamp */}
      <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.5, marginBottom: 9, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {event.desc}
      </div>
      {/* Date & Location with icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 9 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.textMuted, fontSize: 10 }}>
          <CalendarIcon /><span>{event.date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.textMuted, fontSize: 10 }}>
          <MapPinIcon /><span>{event.loc}</span>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ marginBottom: 9 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: C.textSecondary, fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: C.greenDark }}>{event.current}</span> / {event.needed} volunteers
          </span>
          <span style={{ fontSize: 9, color: full ? C.textMuted : C.greenAccent, fontWeight: 600 }}>
            {full ? 'Full' : `${spots} left`}
          </span>
        </div>
        <div style={{ width: '100%', height: 5, borderRadius: 3, background: C.borderLight, overflow: 'hidden' }}>
          <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${C.greenAccent},${C.greenMid})` }} />
        </div>
      </div>
      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 9 }}>
        {event.skills.map((sk, i) => (
          <span key={i} style={{
            padding: '1.5px 7px', borderRadius: 20, background: C.greenLight,
            color: C.greenDark, fontSize: 9.5, fontWeight: 600,
          }}>{sk}</span>
        ))}
      </div>
      {/* Sign Up button */}
      <div style={{
        padding: '7px 10px', borderRadius: 10, border: 'none',
        background: full ? C.cream : `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`,
        color: full ? C.textMuted : '#fff', fontWeight: 600, fontSize: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}>
        {full ? 'Event Full' : <><span>Sign Up</span><ArrowIcon /></>}
      </div>
    </div>
  )
}

export default function SceneEvents() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const inOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const outOpacity = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const headerY = interpolate(frame, [0, 16], [12, 0], { extrapolateRight: 'clamp' })
  const searchOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: C.offWhite, fontFamily: "'Asap', sans-serif",
      opacity: inOpacity * outOpacity,
      flexDirection: 'column', display: 'flex',
    }}>
      <MockNavbar active="Events" />

      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: '24px 32px', boxSizing: 'border-box' }}>
        {/* Page header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 16, transform: `translateY(${headerY}px)`,
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em', marginBottom: 3 }}>
              Volunteer Events
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>
              Find opportunities to make a difference.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '7px 11px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: C.white,
              color: C.textSecondary, fontSize: 11, fontWeight: 600,
            }}>
              <MapPinIcon />Show Map
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '7px 11px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: C.white,
              color: C.textSecondary, fontSize: 11, fontWeight: 600,
            }}>
              Refresh
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          marginBottom: 18, opacity: searchOpacity,
        }}>
          <div style={{
            width: '100%', padding: '9px 14px', borderRadius: 12,
            border: `1.5px solid ${C.border}`, background: C.white,
            fontSize: 12, color: C.textMuted, boxSizing: 'border-box',
          }}>
            Search events, organizations, or locations…
          </div>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'nowrap' }}>
          {EVENTS.map((ev, i) => (
            <EventCardMock key={i} event={ev} index={i} frame={frame} fps={fps} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
