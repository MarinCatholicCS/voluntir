import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { C } from '../../constants'

export default function SceneOutro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const inOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  const headlineOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [5, 25], [25, 0], { extrapolateRight: 'clamp' })

  const subOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })

  const btnScale = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 10, stiffness: 80 } })
  const btnOpacity = interpolate(frame, [45, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const pulse = frame > 70 ? 1 + Math.sin((frame - 70) * 0.15) * 0.03 : 1

  const footerOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: '#fff', fontFamily: "'Asap', sans-serif",
      opacity: inOpacity, display: 'flex', flexDirection: 'column',
    }}>
      {/* Main content - matching the CTA section of LandingPage */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 40, fontWeight: 800, color: C.textPrimary,
          letterSpacing: '-0.03em', textAlign: 'center',
          opacity: headlineOpacity, transform: `translateY(${headlineY}px)`,
          lineHeight: 1.15,
        }}>
          Ready to make a difference?
        </div>

        <div style={{
          fontSize: 15, color: C.textSecondary, marginTop: 12,
          opacity: subOpacity, fontWeight: 500,
        }}>
          Join Voluntir today — it's completely free.
        </div>

        <div style={{
          marginTop: 28, opacity: btnOpacity,
          transform: `scale(${btnScale * pulse})`,
        }}>
          <div style={{
            padding: '13px 36px', borderRadius: 14, border: 'none',
            background: C.greenAccent, color: '#fff',
            fontWeight: 700, fontSize: 15,
          }}>
            Log in with Google
          </div>
        </div>
      </div>

      {/* Footer - matching LandingPage footer */}
      <div style={{
        background: C.textPrimary, padding: '28px 24px 22px',
        textAlign: 'center', opacity: footerOpacity,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Voluntir</span>
          <span style={{ background: `linear-gradient(135deg,${C.greenAccent},${C.greenDark})`, color: '#fff', fontSize: 7, fontWeight: 700, padding: '1.5px 5px', borderRadius: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Beta</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 12 }}>
          <span style={{ color: C.greenMid, fontSize: 11, fontWeight: 600 }}>GitHub</span>
          <span style={{ color: C.greenMid, fontSize: 11, fontWeight: 600 }}>Contact</span>
        </div>
        <div style={{ fontSize: 9, color: C.textMuted }}>© 2026 Voluntir. All rights reserved.</div>
      </div>
    </AbsoluteFill>
  )
}
