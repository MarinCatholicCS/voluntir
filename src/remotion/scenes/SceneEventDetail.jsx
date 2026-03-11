import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { C } from '../../constants'
import MockNavbar from './MockNavbar'

// Icons matching the real app
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const MapPinIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ArrowIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

export default function SceneEventDetail() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const inOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
  const outOpacity = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const contentOpacity = (delay) => interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const contentY = (delay) => interpolate(frame, [delay, delay + 12], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Sign up animation
  const btnFrame = 70
  const signed = frame > btnFrame
  const btnScale = signed ? spring({ frame: frame - btnFrame, fps, config: { damping: 10, stiffness: 150 } }) : 1

  // Progress bar
  const barWidth = interpolate(frame, [30, 55], [0, 70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: C.offWhite, fontFamily: "'Asap', sans-serif",
      opacity: inOpacity * outOpacity,
      flexDirection: 'column', display: 'flex',
    }}>
      <MockNavbar active="Events" />

      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: '20px 32px', boxSizing: 'border-box' }}>
        {/* Back button */}
        <div style={{ opacity: contentOpacity(5), marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>← Back to Events</span>
        </div>

        {/* Two column layout matching EventDetail */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, alignItems: 'start' }}>
          {/* Left: main card */}
          <div style={{
            background: C.white, borderRadius: 20,
            border: `1px solid ${C.borderLight}`,
            padding: '22px 20px',
            boxShadow: `0 2px 12px ${C.shadow}`,
          }}>
            {/* Organizer */}
            <div style={{ opacity: contentOpacity(10), transform: `translateY(${contentY(10)}px)` }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.greenAccent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Ocean Guardians
              </span>
            </div>

            {/* Title */}
            <div style={{ opacity: contentOpacity(14), transform: `translateY(${contentY(14)}px)` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '5px 0 10px' }}>
                Beach Cleanup Day
              </div>
            </div>

            {/* Description */}
            <div style={{ opacity: contentOpacity(20), transform: `translateY(${contentY(20)}px)` }}>
              <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.7, margin: '0 0 16px' }}>
                Join us for a morning of cleaning up Stinson Beach! Bring sunscreen and water. Gloves and bags provided. All are welcome.
              </p>
            </div>

            {/* Info cards - cream boxes matching real app */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16,
              opacity: contentOpacity(28), transform: `translateY(${contentY(28)}px)`,
            }}>
              {[
                { icon: <CalendarIcon />, label: 'Date', value: 'Sat, Mar 15, 2026' },
                { icon: <ClockIcon />, label: 'Time', value: '9:00 AM' },
                { icon: <UserIcon />, label: 'Organized by', value: 'Alex M.' },
              ].map((info, i) => (
                <div key={i} style={{
                  background: C.cream, borderRadius: 10, padding: '10px 11px',
                  display: 'flex', alignItems: 'flex-start', gap: 7,
                }}>
                  <div style={{ color: C.greenAccent, marginTop: 1, flexShrink: 0 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontSize: 8, color: C.textMuted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 11, color: C.textPrimary, fontWeight: 500 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar - centered like real app */}
            <div style={{
              maxWidth: 320, margin: '0 auto 16px',
              opacity: contentOpacity(38), transform: `translateY(${contentY(38)}px)`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: C.textSecondary, fontWeight: 500 }}>
                  <span style={{ fontWeight: 700, color: C.greenDark, fontSize: 14 }}>7</span> / 10 volunteers
                </span>
                <span style={{ fontSize: 11, color: C.greenAccent, fontWeight: 600 }}>3 spots left</span>
              </div>
              <div style={{ width: '100%', height: 5, borderRadius: 3, background: C.borderLight, overflow: 'hidden' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${C.greenAccent},${C.greenMid})` }} />
              </div>
            </div>

            {/* Sign up button - centered like real app */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              opacity: contentOpacity(45), transform: `translateY(${contentY(45)}px)`,
            }}>
              {signed ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    padding: '9px 20px', borderRadius: 12,
                    background: C.greenLight, color: C.greenDark,
                    fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 5,
                    transform: `scale(${btnScale})`,
                  }}>
                    <CheckIcon />You're Registered
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '9px 22px', borderRadius: 12, border: 'none',
                  background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`,
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  Sign Up to Volunteer <ArrowIcon />
                </div>
              )}
            </div>
          </div>

          {/* Right: Map placeholder matching LocationMap style */}
          <div style={{
            background: C.white, borderRadius: 20,
            border: `1px solid ${C.borderLight}`,
            boxShadow: `0 2px 12px ${C.shadow}`,
            overflow: 'hidden',
            opacity: contentOpacity(22),
          }}>
            {/* Map header - green gradient like real LocationMap */}
            <div style={{
              background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`,
              padding: '11px 14px',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <div style={{ color: '#fff', opacity: 0.9 }}><MapPinIcon /></div>
              <div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 1 }}>Location</div>
                <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>Stinson Beach, CA</div>
              </div>
            </div>
            {/* Map area placeholder */}
            <div style={{
              height: 220, background: C.cream,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Fake map grid lines */}
              {[0, 1, 2, 3].map(i => (
                <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${25 * (i + 1)}%`, height: 1, background: C.borderLight }} />
              ))}
              {[0, 1, 2, 3].map(i => (
                <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${25 * (i + 1)}%`, width: 1, background: C.borderLight }} />
              ))}
              {/* Pin */}
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: C.greenAccent, border: '2.5px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
              }} />
            </div>
            {/* Map footer */}
            <div style={{ padding: '8px 14px', borderTop: `1px solid ${C.borderLight}` }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '4px 10px', borderRadius: 20,
                background: C.greenLight, color: C.greenDark,
                fontSize: 10, fontWeight: 600,
              }}>
                Open in Google Maps
              </span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
