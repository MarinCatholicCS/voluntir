import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { C } from '../../constants'

export default function SceneIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const outOpacity = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Landing header
  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })

  // Hero content stagger
  const pillOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' })
  const pillY = interpolate(frame, [8, 20], [16, 0], { extrapolateRight: 'clamp' })

  const headlineOpacity = interpolate(frame, [16, 30], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [16, 30], [18, 0], { extrapolateRight: 'clamp' })

  const subOpacity = interpolate(frame, [28, 42], [0, 1], { extrapolateRight: 'clamp' })
  const subY = interpolate(frame, [28, 42], [18, 0], { extrapolateRight: 'clamp' })

  const ctaOpacity = interpolate(frame, [42, 56], [0, 1], { extrapolateRight: 'clamp' })
  const ctaY = interpolate(frame, [42, 56], [18, 0], { extrapolateRight: 'clamp' })

  // Globe placeholder - rotating green circle
  const globeOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' })
  const globeScale = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 60 } })
  const globeRotation = frame * 0.8

  return (
    <AbsoluteFill style={{
      background: '#fff', fontFamily: "'Asap', sans-serif",
      opacity: outOpacity,
    }}>
      {/* Landing header */}
      <div style={{
        height: 52, background: 'rgba(255,255,255,0.92)',
        borderBottom: `1px solid ${C.borderLight}`,
        padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: headerOpacity,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.greenAccent}, ${C.greenDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>V</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: C.textPrimary, letterSpacing: '-0.02em' }}>Voluntir</span>
          <span style={{ background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: '#fff', fontSize: 7, fontWeight: 700, padding: '1.5px 5px', borderRadius: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Beta</span>
        </div>
        <div style={{
          padding: '6px 16px', borderRadius: 8, border: 'none',
          background: C.greenAccent, color: '#fff', fontSize: 12, fontWeight: 700,
        }}>Log in</div>
      </div>

      {/* Hero section */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        padding: '0 60px', gap: 40,
      }}>
        {/* Left: text */}
        <div style={{ flex: '1 1 50%' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: C.greenLight, borderRadius: 100, padding: '4px 12px',
            marginBottom: 20,
            opacity: pillOpacity, transform: `translateY(${pillY}px)`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.greenAccent }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: C.greenDark }}>Free for students & organizations</span>
          </div>

          {/* Headline */}
          <div style={{
            fontSize: 42, fontWeight: 800, color: C.textPrimary,
            letterSpacing: '-0.035em', lineHeight: 1.04, marginBottom: 16,
            opacity: headlineOpacity, transform: `translateY(${headlineY}px)`,
          }}>
            Volunteer Smarter.<br />
            <span style={{ color: C.greenAccent }}>Connect Deeper.</span>
          </div>

          {/* Subtext */}
          <div style={{
            fontSize: 14, fontWeight: 500, color: C.textSecondary,
            lineHeight: 1.65, marginBottom: 24, maxWidth: 380,
            opacity: subOpacity, transform: `translateY(${subY}px)`,
          }}>
            Discover local volunteer events, sign up in seconds, and watch your community impact grow — across the globe.
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 10,
            opacity: ctaOpacity, transform: `translateY(${ctaY}px)`,
          }}>
            <div style={{
              padding: '11px 28px', borderRadius: 11, border: 'none',
              background: C.greenAccent, color: '#fff', fontWeight: 700, fontSize: 14,
            }}>Get started</div>
            <div style={{
              padding: '11px 28px', borderRadius: 11,
              border: `1.5px solid ${C.border}`, background: 'transparent',
              color: C.textSecondary, fontWeight: 600, fontSize: 14,
            }}>Browse as a Guest</div>
          </div>
        </div>

        {/* Right: Globe mockup */}
        <div style={{
          flex: '1 1 40%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: globeOpacity, transform: `scale(${globeScale})`,
        }}>
          <div style={{
            width: 280, height: 280, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${C.greenLight} 0%, ${C.greenMid} 40%, ${C.greenAccent} 70%, ${C.greenDark} 100%)`,
            boxShadow: `0 0 60px ${C.greenLight}, inset 0 0 40px rgba(255,255,255,0.3)`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Rotating "land" spots */}
            {[
              { top: '20%', left: '30%', w: 40, h: 25 },
              { top: '45%', left: '55%', w: 35, h: 20 },
              { top: '65%', left: '25%', w: 30, h: 18 },
              { top: '35%', left: '70%', w: 25, h: 15 },
            ].map((spot, i) => (
              <div key={i} style={{
                position: 'absolute', top: spot.top,
                left: `calc(${spot.left} + ${Math.sin((globeRotation + i * 60) * Math.PI / 180) * 10}px)`,
                width: spot.w, height: spot.h, borderRadius: '40%',
                background: 'rgba(255,255,255,0.25)',
              }} />
            ))}
            {/* Green dot markers */}
            {[
              { top: '28%', left: '40%' },
              { top: '50%', left: '60%' },
              { top: '42%', left: '30%' },
            ].map((dot, i) => (
              <div key={i} style={{
                position: 'absolute', top: dot.top, left: dot.left,
                width: 6, height: 6, borderRadius: '50%',
                background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              }} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
